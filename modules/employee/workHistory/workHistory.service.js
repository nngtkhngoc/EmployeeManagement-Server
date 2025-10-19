import BaseService from "../../../core/service/baseService.js";
import { prisma } from "../../../config/db.js";
import { hashPassword } from "../../../config/bcrypt.js";

class WorkHistoryService extends BaseService {
  constructor(repository) {
    super(repository);
  }

  async createInitialWorkHistory(tx, workHistoryData) {
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

  async readById(id) {
    return prisma.workHistory.findUnique({
      where: { id },
      include: {
        department: true,
        position: true,
        managedDepartment: true,
        contractsAsSigner: true,
        contractsSigned: true,
        workHistory: true,
        leaveApplications: true,
        updateRequestsMade: true,
        updateRequestsReviewed: true,
        payrollDetails: true,
        attendanceDetails: true,
        performanceDetails: true,
        supervisedReports: true,
      },
    });
  }
}

export default new WorkHistoryService(prisma.workHistory);
