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
    return super.update(filter, this.removeUndefindedProps(data));
  }

  async read(filter, query) {
    return super.read(this.toSearchFilter(filter), query);
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
  async getRequestsInReview(query = {}) {
    return this.read({ status: "IN_REVIEW" }, query);
  }
}

export default new UpdateRequestService(prisma.updateRequest);
