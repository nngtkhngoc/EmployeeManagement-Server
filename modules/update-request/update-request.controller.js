import catchAsync from "../../common/catchAsync.js";
import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import { BadRequestException } from "../../common/exceptions/exception.js";
import updateRequestService from "./update-request.service.js";

const updateRequestController = {
  async getAll(req, res) {
    const updateRequests = await updateRequestService.read(req.body, req.query);
    res.status(200).json(new SuccessResponseDto(updateRequests));
  },

  async getById(req, res) {
    const { requestId } = req.params;
    const updateRequest = await updateRequestService.readById(
      parseInt(requestId)
    );

    res.status(200).json(new SuccessResponseDto(updateRequest));
  },

  async create(req, res) {
    const { oldValue, newValue, reason, requestedById } = req.body;
    const updateRequest = await updateRequestService.create({
      oldValue,
      newValue,
      reason,
      requestedById,
      reviewedById: null,
      status: "PENDING",
    });
    res.status(201).json(new SuccessResponseDto(updateRequest));
  },

  async update(req, res) {
    const { requestId } = req.params;

    const request = await updateRequestService.readById(parseInt(requestId));

    if (!request) throw new BadRequestException("Update request not found");

    const { oldValue, newValue, reason, reviewedById, status } = req.body;

    let updateData = { oldValue, newValue, reason };
    if (reviewedById !== undefined) {
      updateData.reviewedById = reviewedById;
      updateData.status = "IN_REVIEW";
    }
    if (status !== undefined) {
      updateData.status = status;
    }

    const updated = await updateRequestService.update(
      { id: parseInt(requestId) },
      updateData
    );

    res.status(201).json(new SuccessResponseDto(updated));
  },

  async delete(req, res) {
    const { requestId } = req.params;
    const request = await updateRequestService.readById(parseInt(requestId));

    if (!request) throw new BadRequestException("Update request not found");

    await updateRequestService.delete({ id: parseInt(requestId) });
    res.status(200).json(new SuccessResponseDto({}));
  },

  async assignReviewer(req, res) {
    const { requestId } = req.params;
    const { reviewedById } = req.body;

    const request = await updateRequestService.readById(parseInt(requestId));

    if (!request) throw new BadRequestException("Update request not found");

    const updated = await updateRequestService.update(
      { id: parseInt(requestId) },
      {
        reviewedById: parseInt(reviewedById),
        status: "IN_REVIEW",
      }
    );

    res.status(200).json(new SuccessResponseDto(updated));
  },

  async reviewRequest(req, res) {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "NOT_APPROVED"].includes(status)) {
      throw new BadRequestException("Status must be APPROVED or NOT_APPROVED");
    }

    const request = await updateRequestService.readById(parseInt(requestId));

    if (!request) throw new BadRequestException("Update request not found");

    const updated = await updateRequestService.update(
      { id: parseInt(requestId) },
      { status }
    );

    res.status(200).json(new SuccessResponseDto(updated));
  },
};

Object.entries(updateRequestController).forEach(([key, value]) => {
  updateRequestController[key] = catchAsync(value);
});

export default updateRequestController;
