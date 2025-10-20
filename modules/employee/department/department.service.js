import BaseService from "../../../core/service/baseService.js";
import { prisma } from "../../../config/db.js";
import employeeService from "../employee/employee.service.js";

class DepartmentService extends BaseService {
  constructor(repository) {
    super(repository);
  }
  async create(departmentData) {
    return prisma.$transaction(async tx => {
      if (departmentData.managerId) {
        const manager = await tx.employee.findUnique({
          where: { id: departmentData.managerId },
          include: {
            position: true,
            department: true,
          },
        });

        if (!manager) throw new Error("Mã nhân viên không tồn tại.");

        if (manager.position.name !== "Manager") {
          await tx.employee.update({
            where: { id: departmentData.managerId },
            data: {
              position: { connect: { id: 2 } },
            },
          });
        }

        if (
          manager.departmentId &&
          manager.departmentId !== departmentData.id
        ) {
          await tx.employee.update({
            where: { id: manager.id },
            data: {
              department: { disconnect: true },
            },
          });
        }
      }

      const department = await tx.department.create({
        data: {
          departmentCode: departmentData.departmentCode,
          name: departmentData.name,
          description: departmentData.description,
          foundedAt: departmentData.foundedAt,
          manager: departmentData.managerId
            ? { connect: { id: departmentData.managerId } }
            : undefined,
        },
        include: {
          manager: true,
        },
      });

      if (departmentData.managerId) {
        await tx.employee.update({
          where: { id: departmentData.managerId },
          data: {
            department: { connect: { id: department.id } },
          },
        });
      }

      return department;
    });
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
        manager: true,
        employees: true,
      },
    });
  }
}

export default new DepartmentService(prisma.department);
