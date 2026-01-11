import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import catchAsync from "../../common/catchAsync.js";
import streamService from "./stream.service.js";
import { BadRequestException } from "../../common/exceptions/exception.js";

const streamController = {
  /**
   * Generate Stream token for video calling
   * POST /api/stream/token
   */
  async generateToken(req, res) {
    const userId = req.user.id;
    const { callId } = req.body; // Optional: if not provided, uses user's department

    const result = await streamService.generateStreamToken(userId, callId);

    return res.status(200).json(new SuccessResponseDto(result));
  },

  /**
   * Verify if user can join a call
   * POST /api/stream/verify-access
   */
  async verifyAccess(req, res) {
    const userId = req.user.id;
    const { callId } = req.body;

    if (!callId) {
      throw new BadRequestException("callId là bắt buộc");
    }

    const result = await streamService.verifyCallAccess(userId, callId);

    return res.status(200).json(new SuccessResponseDto(result));
  },

  /**
   * Get department call ID for current user
   * GET /api/stream/department-call-id
   */
  async getDepartmentCallId(req, res) {
    const userId = req.user.id;

    const result = await streamService.getDepartmentCallId(userId);

    return res.status(200).json(new SuccessResponseDto(result));
  },
};

Object.entries(streamController).forEach(([key, value]) => {
  streamController[key] = catchAsync(value);
});

export default streamController;

