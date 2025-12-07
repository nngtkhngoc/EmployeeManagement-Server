import { prisma } from "../../config/db.js";
import BaseService from "../../core/service/baseService.js";

class UpdateRequestService extends BaseService {
  constructor(repository) {
    super(repository);
  }

  removeUndefindedProps(data) {
    Object.keys(data).forEach(
      key => data[key] === undefined && delete data[key]
    );
    return data;
  }

  async create(data) {
    return this.repository.create({
      data,
      include: {
        requestedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  toSearchFilter(filter) {
    if (!filter || typeof filter !== "object") return {};
    const { status, requestedById, reviewedById } = filter;

    const where = {};
    if (status !== undefined) where.status = status;
    if (requestedById !== undefined) where.requestedById = requestedById;
    if (reviewedById !== undefined) where.reviewedById = reviewedById;
    return { where };
  }

  async update(filter, data) {
    const cleanData = this.removeUndefindedProps(data);
    return this.repository.update({
      where: filter,
      data: cleanData,
      include: {
        requestedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async read(filter = {}, query = {}) {
    const searchFilter = this.toSearchFilter(filter);
    const queryOptions = {
      ...searchFilter,
      include: {
        requestedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    };
    return super.read(queryOptions, query);
  }

  async readById(id, queryObj = {}) {
    return this.repository.findUnique({
      where: { id },
      include: {
        requestedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      ...queryObj,
    });
  }


  // Get requests by reviewer (for managers to see their assigned requests)
  async getRequestsByReviewer(reviewerId, query = {}) {
    return this.read({ reviewedById: reviewerId }, query);
  }

  // Get requests by requester (for employees to see their own requests)
  async getRequestsByRequester(requesterId, query = {}) {
    return this.read({ requestedById: requesterId }, query);
  }

  // Get pending requests (for HR to see unassigned requests)
  async getPendingRequests(query = {}) {
    return this.read({ status: "PENDING" }, query);
  }

  // Get requests in review (for HR to track assigned requests)
  // Note: Since IN_REVIEW is removed, this method returns requests that have reviewer assigned but still pending
  async getRequestsInReview(query = {}) {
    return this.repository.findMany({
      where: {
        status: "PENDING",
        reviewedById: { not: null },
      },
      ...query,
    });
  }
}

export default new UpdateRequestService(prisma.updateRequest);
