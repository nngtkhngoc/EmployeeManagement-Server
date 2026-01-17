import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import catchAsync from "../../common/catchAsync.js";
import githubService from "./github.service.js";
import githubValidation from "../../validations/github.validation.js";

const githubController = {
    /**
     * Invite a single employee to project's GitHub repository (async)
     * POST /api/github/:projectId/invite
     */
    inviteToRepo: catchAsync(async (req, res) => {
        const params = await githubValidation.inviteToRepo.params.validateAsync(
            req.params,
            { abortEarly: false }
        );
        const body = await githubValidation.inviteToRepo.body.validateAsync(
            req.body,
            { abortEarly: false }
        );

        // Queue the invitation asynchronously
        githubService.inviteProjectMembersAsync(parseInt(params.projectId), [
            {
                employeeId: body.employeeId,
                githubUsername: body.githubUsername,
                permission: body.permission,
            },
        ]);

        // Return immediately
        res.status(202).json(
            new SuccessResponseDto(
                {
                    projectId: parseInt(params.projectId),
                    githubUsername: body.githubUsername,
                    status: "queued",
                },
                "GitHub invitation queued for processing"
            )
        );
    }),

    /**
     * Invite multiple employees to project's GitHub repository (async)
     * POST /api/github/:projectId/invite/bulk
     */
    inviteBulk: catchAsync(async (req, res) => {
        const params = await githubValidation.inviteBulk.params.validateAsync(
            req.params,
            { abortEarly: false }
        );
        const body = await githubValidation.inviteBulk.body.validateAsync(
            req.body,
            { abortEarly: false }
        );

        // Queue the invitations asynchronously
        githubService.inviteProjectMembersAsync(
            parseInt(params.projectId),
            body.invitations
        );

        // Return immediately
        res.status(202).json(
            new SuccessResponseDto(
                {
                    projectId: parseInt(params.projectId),
                    totalInvitations: body.invitations.length,
                    status: "queued",
                },
                `${body.invitations.length} GitHub invitation(s) queued for processing`
            )
        );
    }),

    /**
     * Remove a user from project's GitHub repository (async)
     * DELETE /api/github/:projectId/collaborator
     */
    removeFromRepo: catchAsync(async (req, res) => {
        const params = await githubValidation.removeFromRepo.params.validateAsync(
            req.params,
            { abortEarly: false }
        );
        const body = await githubValidation.removeFromRepo.body.validateAsync(
            req.body,
            { abortEarly: false }
        );

        // Queue the removal asynchronously
        githubService.removeUserAsync(
            parseInt(params.projectId),
            body.githubUsername
        );

        // Return immediately
        res.status(202).json(
            new SuccessResponseDto(
                {
                    projectId: parseInt(params.projectId),
                    githubUsername: body.githubUsername,
                    status: "queued",
                },
                "GitHub collaborator removal queued for processing"
            )
        );
    }),

    /**
     * Check GitHub App configuration status
     * GET /api/github/status
     */
    getStatus: catchAsync(async (req, res) => {
        const isConfigured = githubService.isConfigured();

        res.status(200).json(
            new SuccessResponseDto({
                configured: isConfigured,
                message: isConfigured
                    ? "GitHub App is configured and ready"
                    : "GitHub App is not configured. Please check environment variables.",
            })
        );
    }),
};

export default githubController;
