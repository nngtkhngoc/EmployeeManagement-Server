import BaseService from "../../../core/service/baseService.js";
import { prisma } from "../../../config/db.js";
import { hashPassword } from "../../../config/bcrypt.js";
import workHistoryService from "../workHistory/workHistory.service.js";
import departmentService from "../department/department.service.js";

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
        const updatedDepartment = await departmentService.update(
          tx,
          { id: parseInt(departmentId) },
          {
            manager: { connect: { id: newEmployee.id } },
          }
        );

        newEmployee.department = updatedDepartment;
      }

      const workHistory = await workHistoryService.createWorkHistory(tx, {
        employeeId: newEmployee.id,
        departmentId: newEmployee.departmentId,
        positionId: newEmployee.positionId,
      });

      newEmployee.workHistory = workHistory;

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

  async update(id, employeeData) {
    return prisma.$transaction(async tx => {
      const { departmentId, positionId, workStatus } = employeeData;

      // Tìm nhân viên hiện tại
      const existingEmployee = await tx.employee.findUnique({
        where: { id },
        include: { position: true, department: true },
      });
      if (!existingEmployee) throw new Error("Nhân viên không tồn tại");

      // Nếu nghỉ việc => kết thúc work history
      if (
        workStatus &&
        ["RESIGNED", "TERMINATED", "RETIRED"].includes(workStatus)
      ) {
        await workHistoryService.endWorkHistory(tx, existingEmployee.id);
      }

      // Nếu có thay đổi phòng ban hoặc vị trí => kiểm tra hợp lệ
      const isDepartmentChanged =
        departmentId && departmentId !== existingEmployee.departmentId;
      const isPositionChanged =
        positionId && positionId !== existingEmployee.positionId;

      if (isDepartmentChanged || isPositionChanged) {
        if (departmentId) {
          const department = await tx.department.findUnique({
            where: { id: departmentId },
          });
          if (!department) throw new Error("Phòng ban không tồn tại");
        }

        if (positionId) {
          const position = await tx.position.findUnique({
            where: { id: positionId },
          });
          if (!position) throw new Error("Vị trí không tồn tại");
        }

        // Cập nhật lại work history
        await workHistoryService.updateWorkHistory(tx, {
          employeeId: existingEmployee.id,
          departmentId: departmentId || existingEmployee.departmentId,
          positionId: positionId || existingEmployee.positionId,
        });
      }

      const cleanData = Object.fromEntries(
        Object.entries(employeeData).filter(
          ([key, value]) =>
            value !== undefined &&
            key !== "departmentId" &&
            key !== "positionId"
        )
      );

      // Cập nhật thông tin nhân viên
      const updatedEmployee = await tx.employee.update({
        where: { id },
        data: {
          ...cleanData,
          ...(departmentId && {
            department: { connect: { id: departmentId } },
          }),
          ...(positionId && { position: { connect: { id: positionId } } }),
        },
        include: {
          department: true,
          position: true,
        },
      });

      // Kiểm tra thay đổi chức vụ quản lý
      const oldPositionName = existingEmployee.position?.name?.toLowerCase();
      const newPositionName = updatedEmployee.position?.name?.toLowerCase();

      // Nếu từ Manager => chức vụ khác => bỏ managerId trong department cũ
      if (oldPositionName === "manager" && newPositionName !== "manager") {
        await departmentService.update(
          tx,
          { id: existingEmployee.departmentId },
          { manager: { disconnect: true } }
        );
      }

      // Nếu từ chức vụ khác => Manager => set managerId cho department mới
      if (newPositionName === "manager") {
        const updatedDepartment = await departmentService.update(
          tx,
          { id: departmentId || updatedEmployee.departmentId },
          { manager: { connect: { id: updatedEmployee.id } } }
        );

        updatedEmployee.department = updatedDepartment;
      }

      return updatedEmployee;
    });
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
}

export default new EmployeeService(prisma.employee);
