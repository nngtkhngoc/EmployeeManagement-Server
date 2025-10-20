import BaseService from "../../../core/service/baseService.js";
import { prisma } from "../../../config/db.js";

class DepartmentService extends BaseService {
  constructor(repository) {
    super(repository);
  }

  async updateManager(tx, filter, departmentData) {
    return tx.department.update({
      where: filter,
      data: departmentData,
    });
  }

  async readById(id) {
    return prisma.department.findUnique({
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

export default new DepartmentService(prisma.department);
