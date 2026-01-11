import express from "express";
import updateRequestController from "./update-request.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

// Basic CRUD routes
router
  .route("/")
  .get(updateRequestController.getAll)
  .post(updateRequestController.create);

router
  .route("/:requestId")
  .get(updateRequestController.getById)
  .put(updateRequestController.update)
  .delete(updateRequestController.delete);

// Special routes for HR and reviewers
router
  .route("/:requestId/assign-reviewer")
  .put(updateRequestController.assignReviewer);

router
  .route("/:requestId/review")
  .put(verifyToken, updateRequestController.reviewRequest);

export default router;
