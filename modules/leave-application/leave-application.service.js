import { prisma } from "../../config/db.js";
import BaseService from "../../core/service/baseService.js";

class LeaveApplicationService extends BaseService {
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
    const { startDate, endDate, status, employeeId, leaveTypeId } = filter;

    const where = {};
    if (startDate) where.startDate = { gte: startDate };
    if (endDate) where.endDate = { lte: endDate };
    if (status !== undefined) where.status = status;
    if (employeeId !== undefined) where.employeeId = employeeId;
    if (leaveTypeId !== undefined) where.leaveTypeId = leaveTypeId;
    return { where };
  }

  async update(filter, data) {
    return super.update(filter, this.removeUndefindedProps(data));
  }

  async read(filter, query) {
    return super.read(this.toSearchFilter(filter), query);
  }
}

export default new LeaveApplicationService(prisma.leaveApplication);
