import catchAsync from "../../common/catchAsync.js";
import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import { BadRequestException } from "../../common/exceptions/exception.js";
import updateRequestService from "./update-request.service.js";
import updateRequestValidation from "../../validations/update-request.validation.js";

const updateRequestController = {
  async getAll(req, res) {
    // Pre-parse query params to convert string numbers to numbers
    const query = { ...req.query };
    if (query.page) query.page = parseInt(query.page) || query.page;
    if (query.limit) query.limit = parseInt(query.limit) || query.limit;
    if (query.requestedById)
      query.requestedById =
        parseInt(query.requestedById) || query.requestedById;
    if (query.reviewedById)
      query.reviewedById = parseInt(query.reviewedById) || query.reviewedById;

    const validatedQuery = await updateRequestValidation
      .getUpdateRequestsValidate()
      .validateAsync(query, {
        abortEarly: false,
      });

    // Extract pagination and sorting params
    const {
      page: tmpPage,
      limit: tmpLimit,
      sort: tmpSort,
      ...filterParams
    } = validatedQuery;

    // Parse page and limit, ensure they are valid numbers
    let page = 1;
    if (tmpPage !== undefined && tmpPage !== null) {
      const parsedPage = parseInt(tmpPage);
      if (!isNaN(parsedPage) && parsedPage > 0) {
        page = parsedPage;
      }
    }

    let limit = 20;
    if (tmpLimit !== undefined && tmpLimit !== null) {
      const parsedLimit = parseInt(tmpLimit);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = parsedLimit;
      }
    }

    // Parse sort: format "field:asc" or "field:desc" or just "field" (default asc)
    // Use actual Prisma field names from schema (created_at, updated_at, etc.)
    const validSortFields = [
      "id",
      "status",
      "content",
      "created_at",
      "updated_at",
      "requestedById",
      "reviewedById",
    ];

    let sortBy = "created_at"; // Default to created_at (Prisma field name)
    let sortOrder = "desc";
    if (tmpSort && typeof tmpSort === "string" && tmpSort.trim() !== "") {
      const sortParts = tmpSort.split(":");
      if (sortParts[0] && sortParts[0].trim() !== "") {
        const field = sortParts[0].trim();
        // Use field as-is if valid, otherwise default to created_at
        sortBy = validSortFields.includes(field) ? field : "created_at";
        if (
          sortParts[1] &&
          (sortParts[1].toLowerCase() === "desc" ||
            sortParts[1].toLowerCase() === "asc")
        ) {
          sortOrder = sortParts[1].toLowerCase();
        } else {
          sortOrder = "asc";
        }
      }
    }

    // Build options for baseService.read
    const options = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    try {
      const updateRequests = await updateRequestService.read(
        filterParams,
        options
      );
      res.status(200).json(new SuccessResponseDto(updateRequests));
    } catch (error) {
      console.error("Error in getAll update-request:", error);
      throw error;
    }
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
        reviewedById: parseInt(reviewedById),
      }
    );

    res.status(200).json(new SuccessResponseDto(updated));
  },
};

Object.entries(updateRequestController).forEach(([key, value]) => {
  updateRequestController[key] = catchAsync(value);
});

export default updateRequestController;
