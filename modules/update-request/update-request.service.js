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
    const {
      status,
      requestedById,
      reviewedById,
      content,
      created_date_from,
      created_date_to,
      updated_date_from,
      updated_date_to,
    } = filter;

    const where = {};

    if (status !== undefined) where.status = status;
    if (requestedById !== undefined) where.requestedById = requestedById;
    if (reviewedById !== undefined) where.reviewedById = reviewedById;

    // Search by content
    if (content !== undefined && content !== null && content !== "") {
      where.content = {
        contains: content,
        mode: "insensitive",
      };
    }

    // Date range filters
    if (created_date_from || created_date_to) {
      where.created_at = {};
      if (created_date_from) {
        const dateFrom = new Date(created_date_from);
        if (!isNaN(dateFrom.getTime())) {
          where.created_at.gte = dateFrom;
        }
      }
      if (created_date_to) {
        const dateTo = new Date(created_date_to);
        if (!isNaN(dateTo.getTime())) {
          // Set to end of day
          dateTo.setHours(23, 59, 59, 999);
          where.created_at.lte = dateTo;
        }
      }
    }

    if (updated_date_from || updated_date_to) {
      where.updated_at = {};
      if (updated_date_from) {
        const dateFrom = new Date(updated_date_from);
        if (!isNaN(dateFrom.getTime())) {
          where.updated_at.gte = dateFrom;
        }
      }
      if (updated_date_to) {
        const dateTo = new Date(updated_date_to);
        if (!isNaN(dateTo.getTime())) {
          // Set to end of day
          dateTo.setHours(23, 59, 59, 999);
          where.updated_at.lte = dateTo;
        }
      }
    }

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
    // Extract where clause to ensure it's clean for count()
    const where = searchFilter.where || {};

    const queryOptions = {
      where,
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
