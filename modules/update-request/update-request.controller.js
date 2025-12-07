import catchAsync from "../../common/catchAsync.js";
import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import { BadRequestException } from "../../common/exceptions/exception.js";
import updateRequestService from "./update-request.service.js";
import * as updateRequestValidation from "../../validations/update-request.validation.js";

const updateRequestController = {
  async getAll(req, res) {
    const query = await updateRequestValidation
      .getUpdateRequestsValidate()
      .validateAsync(req.query, {
        abortEarly: false,
      });
    const updateRequests = await updateRequestService.read(query, req.query);
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
    const data = await updateRequestValidation
      .createUpdateRequestValidate()
      .validateAsync(req.body, {
        abortEarly: false,
      });
    
    const { content, requestedById } = data;
    const updateRequest = await updateRequestService.create({
      content,
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

    const data = await updateRequestValidation
      .updateUpdateRequestValidate()
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const { content, reviewedById, status } = data;

    let updateData = {};
    if (content !== undefined) {
      updateData.content = content;
    }
    if (reviewedById !== undefined) {
      updateData.reviewedById = reviewedById;
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
        // Status vẫn là PENDING khi assign reviewer
      }
    );

    res.status(200).json(new SuccessResponseDto(updated));
  },

  async reviewRequest(req, res) {
    const { requestId } = req.params;
    
    const data = await updateRequestValidation
      .reviewRequestValidate()
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const { status } = data;
    
    // Tự động lấy ID người phê duyệt từ token
    const reviewedById = req.user?.id;
    
    if (!reviewedById) {
      throw new BadRequestException("User not authenticated");
    }

    const request = await updateRequestService.readById(parseInt(requestId));

    if (!request) throw new BadRequestException("Update request not found");

    // Update request status và tự động gán người phê duyệt
    const updated = await updateRequestService.update(
      { id: parseInt(requestId) },
      { 
        status,
        reviewedById: parseInt(reviewedById)
      }
    );

    res.status(200).json(new SuccessResponseDto(updated));
  },
};

Object.entries(updateRequestController).forEach(([key, value]) => {
  updateRequestController[key] = catchAsync(value);
});

export default updateRequestController;
