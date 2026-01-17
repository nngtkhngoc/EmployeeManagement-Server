import express from "express";
import githubController from "./github.controller.js";

const router = express.Router();

// GitHub App status
router.get("/status", githubController.getStatus);

// Project-specific GitHub operations
router.post("/:projectId/invite", githubController.inviteToRepo);
router.post("/:projectId/invite/bulk", githubController.inviteBulk);
router.delete("/:projectId/collaborator", githubController.removeFromRepo);

export default router;
