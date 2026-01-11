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

/**
 * Meeting routes
 */
/**
 * @route   GET /api/stream/meetings
 * @desc    Get all meetings
 * @access  Private (requires authentication)
 */
router.get("/meetings", verifyToken, streamController.getAllMeetings);

/**
 * @route   GET /api/stream/meetings/:id
 * @desc    Get meeting by ID
 * @access  Private (requires authentication)
 */
router.get("/meetings/:id", verifyToken, streamController.getMeetingById);

/**
 * @route   POST /api/stream/meetings
 * @desc    Create a new meeting
 * @access  Private (requires authentication)
 */
router.post("/meetings", verifyToken, streamController.createMeeting);

/**
 * @route   PUT /api/stream/meetings/:id
 * @desc    Update meeting
 * @access  Private (requires authentication)
 */
router.put("/meetings/:id", verifyToken, streamController.updateMeeting);

/**
 * @route   DELETE /api/stream/meetings/:id
 * @desc    Delete meeting
 * @access  Private (requires authentication)
 */
router.delete("/meetings/:id", verifyToken, streamController.deleteMeeting);

export default router;

