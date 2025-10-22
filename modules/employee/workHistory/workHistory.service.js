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
}

export default new WorkHistoryService(prisma.workHistory);
