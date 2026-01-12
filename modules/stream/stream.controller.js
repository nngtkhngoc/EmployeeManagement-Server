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

  /**
   * Get all meetings
   * GET /api/stream/meetings
   */
  async getAllMeetings(req, res) {
    const query = { ...req.query };
    if (query.page) query.page = parseInt(query.page) || query.page;
    if (query.limit) query.limit = parseInt(query.limit) || query.limit;
    if (query.departmentId)
      query.departmentId = parseInt(query.departmentId) || query.departmentId;
    if (query.createdById)
      query.createdById = parseInt(query.createdById) || query.createdById;

    const result = await streamService.getAllMeetings(query);
    return res.status(200).json(new SuccessResponseDto(result));
  },

  /**
   * Get meeting by ID
   * GET /api/stream/meetings/:id
   */
  async getMeetingById(req, res) {
    const { id } = req.params;
    const result = await streamService.getMeetingById(id);
    return res.status(200).json(new SuccessResponseDto(result));
  },

  /**
   * Create a new meeting
   * POST /api/stream/meetings
   */
  async createMeeting(req, res) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException("Người dùng chưa đăng nhập");
    }

    const meetingData = {
      ...req.body,
      createdById: userId,
    };

    const result = await streamService.createMeeting(meetingData);
    return res.status(201).json(new SuccessResponseDto(result));
  },

  /**
   * Update meeting
   * PUT /api/stream/meetings/:id
   */
  async updateMeeting(req, res) {
    const { id } = req.params;
    const result = await streamService.updateMeeting(id, req.body);
    return res.status(200).json(new SuccessResponseDto(result));
  },

  /**
   * Delete meeting
   * DELETE /api/stream/meetings/:id
   */
  async deleteMeeting(req, res) {
    const { id } = req.params;
    await streamService.deleteMeeting(id);
    return res.status(200).json(
      new SuccessResponseDto({
        message: "Xóa cuộc họp thành công",
      })
    );
  },
};

Object.entries(streamController).forEach(([key, value]) => {
  streamController[key] = catchAsync(value);
});

export default streamController;
