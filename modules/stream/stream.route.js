import express from "express";
import streamController from "./stream.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

/**
 * @route   POST /api/stream/token
 * @desc    Generate Stream token for video calling
 * @access  Private (requires authentication)
 */
router.post("/token", verifyToken, streamController.generateToken);

/**
 * @route   POST /api/stream/verify-access
 * @desc    Verify if user can join a call (department check)
 * @access  Private (requires authentication)
 */
router.post("/verify-access", verifyToken, streamController.verifyAccess);

/**
 * @route   GET /api/stream/department-call-id
 * @desc    Get department call ID for current user
 * @access  Private (requires authentication)
 */
router.get("/department-call-id", verifyToken, streamController.getDepartmentCallId);

export default router;

