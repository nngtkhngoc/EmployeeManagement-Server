import { App } from "@octokit/app";
import { Octokit } from "@octokit/rest";
import { prisma } from "../../config/db.js";

class GitHubService {
    constructor() {
        this.privateKey = null;
        this.initializePrivateKey();
    }

    /**
     * Initialize GitHub App private key from environment variables
     * The private key is shared across all projects, but each project has its own App ID and Installation ID
     */
    initializePrivateKey() {
        const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

        if (!privateKey) {
            console.warn(
                "GitHub App private key not configured. GitHub integration will not work."
            );
            return;
        }

        try {
            // Handle escaped newlines in the private key
            this.privateKey = privateKey.replace(/\\n/g, "\n");
            console.log("GitHub App private key loaded successfully");
        } catch (error) {
            console.error("Error loading GitHub App private key:", error.message);
        }
    }

    /**
     * Get Octokit instance for a specific project
     * @param {number} projectId - Project ID
     * @returns {Promise<{octokit: Octokit, project: Object}>} Authenticated Octokit instance and project details
     */
    async getOctokitForProject(projectId) {
        if (!this.privateKey) {
            throw new Error(
                "GitHub App private key is not configured. Please check your environment variables."
            );
        }

        // Get project's GitHub App credentials
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                name: true,
                githubRepoUrl: true,
                githubAppId: true,
                githubAppInstallationId: true,
            },
        });

        if (!project) {
            throw new Error("Project not found");
        }

        if (!project.githubRepoUrl) {
            throw new Error("Project does not have a GitHub repository configured");
        }

        if (!project.githubAppId || !project.githubAppInstallationId) {
            throw new Error(
                "Project does not have GitHub App credentials configured. Please set githubAppId and githubAppInstallationId."
            );
        }

        // Create App instance with project-specific credentials
        const app = new App({
            appId: project.githubAppId,
            privateKey: this.privateKey,
        });

        // Get installation-specific Octokit
        const octokit = await app.getInstallationOctokit(
            parseInt(project.githubAppInstallationId)
        );

        return { octokit, project };
    }

    /**
     * Parse GitHub repository URL to extract owner and repo name
     * Supports formats:
     * - https://github.com/owner/repo
     * - git@github.com:owner/repo.git
     * - owner/repo
     */
    parseRepoUrl(url) {
        if (!url) {
            throw new Error("Repository URL is required");
        }

        // Remove trailing .git if present
        url = url.replace(/\.git$/, "");

        // Handle HTTPS format: https://github.com/owner/repo
        const httpsMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (httpsMatch) {
            return {
                owner: httpsMatch[1],
                repo: httpsMatch[2],
            };
        }

        // Handle SSH format: git@github.com:owner/repo
        const sshMatch = url.match(/git@github\.com:([^\/]+)\/(.+)/);
        if (sshMatch) {
            return {
                owner: sshMatch[1],
                repo: sshMatch[2],
            };
        }

        // Handle short format: owner/repo
        const shortMatch = url.match(/^([^\/]+)\/([^\/]+)$/);
        if (shortMatch) {
            return {
                owner: shortMatch[1],
                repo: shortMatch[2],
            };
        }

        throw new Error("Invalid GitHub repository URL format");
    }

    /**
     * Check if GitHub App private key is configured
     */
    isConfigured() {
        return this.privateKey !== null;
    }

    /**
     * Invite a user to a repository
     * @param {number} projectId - Project ID
     * @param {string} username - GitHub username to invite
     * @param {string} permission - Permission level (pull, push, admin, maintain, triage)
     */
    async inviteUserToRepo(projectId, username, permission = "push") {
        const { octokit, project } = await this.getOctokitForProject(projectId);
        const { owner, repo } = this.parseRepoUrl(project.githubRepoUrl);

        try {
            // Add collaborator to repository
            const response = await octokit.rest.repos.addCollaborator({
                owner,
                repo,
                username,
                permission,
            });

            return {
                success: true,
                invitationId: response.data.id,
                invitee: username,
                repository: `${owner}/${repo}`,
                permission,
                message:
                    response.status === 201
                        ? "Invitation sent successfully"
                        : "User already has access",
            };
        } catch (error) {
            // Handle specific GitHub API errors
            if (error.status === 404) {
                throw new Error(
                    `Repository ${owner}/${repo} not found or GitHub App doesn't have access`
                );
            } else if (error.status === 403) {
                throw new Error(
                    "Insufficient permissions. Ensure the GitHub App has 'Administration' permission."
                );
            } else if (error.status === 422) {
                throw new Error(`User '${username}' not found on GitHub`);
            }

            throw new Error(`GitHub API error: ${error.message}`);
        }
    }

    /**
     * Invite multiple users to a repository
     * @param {number} projectId - Project ID
     * @param {Array<{username: string, permission?: string}>} users - Array of users to invite
     */
    async inviteMultipleUsers(projectId, users) {
        const results = [];
        const errors = [];

        for (const user of users) {
            try {
                const result = await this.inviteUserToRepo(
                    projectId,
                    user.username,
                    user.permission || "push"
                );
                results.push(result);
            } catch (error) {
                errors.push({
                    username: user.username,
                    error: error.message,
                });
            }
        }

        return {
            success: errors.length === 0,
            results,
            errors,
            summary: {
                total: users.length,
                successful: results.length,
                failed: errors.length,
            },
        };
    }

    /**
     * Invite project members to the project's GitHub repository
     * @param {number} projectId - Project ID
     * @param {Array<{employeeId: number, githubUsername: string, permission?: string}>} invitations
     */
    async inviteProjectMembers(projectId, invitations) {
        // Validate that all employees exist
        const employeeIds = invitations.map((inv) => inv.employeeId);
        const employees = await prisma.employee.findMany({
            where: {
                id: { in: employeeIds },
                isActive: true,
            },
            select: { id: true, fullName: true, email: true },
        });

        if (employees.length !== employeeIds.length) {
            throw new Error("Some employees not found or inactive");
        }

        // Prepare users for invitation
        const users = invitations.map((inv) => ({
            username: inv.githubUsername,
            permission: inv.permission || "push",
        }));

        // Invite users to repository (this will fetch project details internally)
        const result = await this.inviteMultipleUsers(projectId, users);

        // Get project info for response
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { id: true, name: true, githubRepoUrl: true },
        });

        return {
            ...result,
            project: {
                id: project.id,
                name: project.name,
                repository: project.githubRepoUrl,
            },
        };
    }

    /**
     * Remove a user from a repository
     * @param {number} projectId - Project ID
     * @param {string} username - GitHub username to remove
     */
    async removeUserFromRepo(projectId, username) {
        const { octokit, project } = await this.getOctokitForProject(projectId);
        const { owner, repo } = this.parseRepoUrl(project.githubRepoUrl);

        try {
            await octokit.rest.repos.removeCollaborator({
                owner,
                repo,
                username,
            });

            return {
                success: true,
                username,
                repository: `${owner}/${repo}`,
                message: "User removed successfully",
            };
        } catch (error) {
            if (error.status === 404) {
                throw new Error(
                    `Repository ${owner}/${repo} not found or user is not a collaborator`
                );
            }

            throw new Error(`GitHub API error: ${error.message}`);
        }
    }

    /**
     * Invite user to repository asynchronously (non-blocking)
     * @param {number} projectId - Project ID
     * @param {string} username - GitHub username to invite
     * @param {string} permission - Permission level
     */
    async inviteUserAsync(projectId, username, permission = "push") {
        // Process in background without blocking
        setImmediate(async () => {
            try {
                const result = await this.inviteUserToRepo(
                    projectId,
                    username,
                    permission
                );
                console.log(
                    `[GitHub] Successfully invited ${username} to project ${projectId}:`,
                    result.message
                );
            } catch (error) {
                console.error(
                    `[GitHub] Failed to invite ${username} to project ${projectId}:`,
                    error.message
                );
            }
        });
    }

    /**
     * Invite multiple users asynchronously (non-blocking)
     * @param {number} projectId - Project ID
     * @param {Array<{username: string, permission?: string}>} users - Array of users to invite
     */
    async inviteMultipleUsersAsync(projectId, users) {
        // Process in background without blocking
        setImmediate(async () => {
            try {
                const result = await this.inviteMultipleUsers(projectId, users);
                console.log(
                    `[GitHub] Invitation summary for project ${projectId}:`,
                    result.summary
                );

                if (result.errors.length > 0) {
                    console.error(`[GitHub] Failed invitations:`, result.errors);
                }
            } catch (error) {
                console.error(
                    `[GitHub] Failed to process invitations for project ${projectId}:`,
                    error.message
                );
            }
        });
    }

    /**
     * Invite project members asynchronously (non-blocking)
     * @param {number} projectId - Project ID
     * @param {Array<{employeeId: number, githubUsername: string, permission?: string}>} invitations
     */
    async inviteProjectMembersAsync(projectId, invitations) {
        // Process in background without blocking
        setImmediate(async () => {
            try {
                const result = await this.inviteProjectMembers(projectId, invitations);
                console.log(
                    `[GitHub] Successfully processed ${result.summary.successful}/${result.summary.total} invitations for project ${projectId}`
                );

                if (result.errors.length > 0) {
                    console.error(
                        `[GitHub] Failed invitations for project ${projectId}:`,
                        result.errors
                    );
                }
            } catch (error) {
                console.error(
                    `[GitHub] Failed to invite project members for project ${projectId}:`,
                    error.message
                );
            }
        });
    }

    /**
     * Verify GitHub connection for a project
     * @param {number} projectId - Project ID
     * @returns {Promise<{connected: boolean, error: string|null}>}
     */
    async verifyConnection(projectId) {
        try {
            const { octokit, project } = await this.getOctokitForProject(projectId);
            const { owner, repo } = this.parseRepoUrl(project.githubRepoUrl);

            // Try to access the repository
            await octokit.rest.repos.get({ owner, repo });

            // Update project's connection status
            await prisma.project.update({
                where: { id: projectId },
                data: {
                    githubConnected: true,
                    githubLastVerified: new Date(),
                },
            });

            return { connected: true, error: null };
        } catch (error) {
            // Update project's connection status to false
            await prisma.project.update({
                where: { id: projectId },
                data: {
                    githubConnected: false,
                    githubLastVerified: new Date(),
                },
            });

            return {
                connected: false,
                error: error.message || "Failed to connect to GitHub repository",
            };
        }
    }

    /**
     * Remove user from repository asynchronously (non-blocking)
     * @param {number} projectId - Project ID
     * @param {string} username - GitHub username to remove
     */
    async removeUserAsync(projectId, username) {
        // Process in background without blocking
        setImmediate(async () => {
            try {
                const result = await this.removeUserFromRepo(projectId, username);
                console.log(
                    `[GitHub] Successfully removed ${username} from project ${projectId}`
                );
            } catch (error) {
                console.error(
                    `[GitHub] Failed to remove ${username} from project ${projectId}:`,
                    error.message
                );
            }
        });
    }
}

export default new GitHubService();
