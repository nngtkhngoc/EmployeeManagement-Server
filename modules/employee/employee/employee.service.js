import BaseService from "../../../core/service/baseService.js";
import { prisma } from "../../../config/db.js";
import { hashPassword } from "../../../config/bcrypt.js";

class EmployeeService extends BaseService {
  constructor(repository) {
    super(repository);
  }

  async create(employeeData) {
    return prisma.$transaction(async tx => {
      const department = await tx.department.findUnique({
        where: { id: employeeData.departmentId },
      });
      if (!department) throw new Error("Phòng ban không tồn tại");

      const position = await tx.position.findUnique({
        where: { id: employeeData.positionId },
      });
      if (!position) throw new Error("Vị trí không tồn tại");

      const [nextVal] =
        await tx.$queryRaw`SELECT nextval('employee_code_seq') AS seq;`;
      const seqNum = nextVal.seq;
      const employeeCode = "EM" + seqNum.toString().padStart(3, "0");

      const password = employeeCode + department.departmentCode;
      const hashedPassword = await hashPassword(password);

      const { departmentId, positionId } = employeeData;
      delete employeeData.departmentId;
      delete employeeData.positionId;

      const newEmployee = await tx.employee.create({
        data: {
          ...employeeData,
          employeeCode,
          password: hashedPassword,
          department: { connect: { id: departmentId } },
          position: { connect: { id: positionId } },
        },
        include: {
          department: true,
          position: true,
        },
      });

      if (position.name.toLowerCase() === "manager") {
        const updatedDepartment = await tx.department.update({
          where: { id: departmentId },
          data: { managerId: newEmployee.id },
        });
        newEmployee.department = updatedDepartment;
      }

      return newEmployee;
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
