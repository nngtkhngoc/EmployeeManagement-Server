import BaseService from "../../../core/service/baseService.js";
import { prisma } from "../../../config/db.js";

class WorkHistoryService extends BaseService {
  constructor(repository) {
    super(repository);
  }

  async createWorkHistory(tx, workHistoryData) {
    return tx.workHistory.create({
      data: {
        startDate: new Date(),
        endDate: null,
        department: { connect: { id: workHistoryData.departmentId } },
        position: { connect: { id: workHistoryData.positionId } },
        employee: { connect: { id: workHistoryData.employeeId } },
      },
      include: {
        department: true,
        position: true,
        employee: true,
      },
    });
  }

  async endWorkHistory(tx, employeeId) {
    return tx.workHistory.updateMany({
      data: {
        endDate: new Date(),
      },
      where: {
        employeeId,
        endDate: null,
      },
    });
  }

  async updateWorkHistory(tx, workHistoryData) {
    this.endWorkHistory(tx, workHistoryData.employeeId);

    return this.createWorkHistory(tx, workHistoryData);
  }

  async read(params = {}, options = {}) {
    const { where = {}, include = {}, select, distinct } = params;
    const { page = 1, limit = 20, sortBy, sortOrder = "asc" } = options;

    const skip = (page - 1) * parseInt(limit);
    const take = parseInt(limit);

    const queryOptions = {
      where,
      include,
      select,
      distinct,
      skip,
      take,
    };

    if (sortBy) {
      queryOptions.orderBy = { [sortBy]: sortOrder };
    }

    const [data, total] = await Promise.all([
      this.repository.findMany(queryOptions),
      this.repository.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async readById(id, include) {
    return this.repository.findUnique({
      where: { id },
      include: include,
    });
  }
}

export default new WorkHistoryService(prisma.workHistory);
