import BaseService from "../../../core/service/baseService.js";
import { prisma } from "../../../config/db.js";

class EmployeeService extends BaseService {
  constructor(repository) {
    super(repository);
  }

  async update(tx, filter, departmentData) {
    console.log(departmentData);
    return tx.department.update({
      where: filter,
      data: departmentData,
    });
  }

  async readById(id) {
    return prisma.employee.findUnique({
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

export default new EmployeeService(prisma.employee);
