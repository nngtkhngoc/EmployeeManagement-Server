import BaseService from "../../../core/service/baseService.js";
import { prisma } from "../../../config/db.js";

class DepartmentService extends BaseService {
  constructor(repository) {
    super(repository);
  }

  async create(departmentData) {
    return prisma.$transaction(async tx => {
      const managerPosition = await tx.position.findUnique({
        where: { name: "Manager" },
      });
      if (!managerPosition)
        throw new Error("Không tìm thấy vị trí 'Manager' trong hệ thống.");

      if (departmentData.managerId) {
        const manager = await tx.employee.findUnique({
          where: { id: departmentData.managerId },
          include: {
            position: true,
            department: true,
          },
        });

        if (!manager) throw new Error("Mã nhân viên không tồn tại.");

        if (manager.position?.name !== "Manager") {
          await tx.employee.update({
            where: { id: departmentData.managerId },
            data: {
              position: { connect: { id: managerPosition.id } },
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

  async update(id, departmentData) {
    return prisma.$transaction(async tx => {
      const existingDept = await tx.department.findUnique({
        where: { id },
        include: { manager: true },
      });
      if (!existingDept) throw new Error("Phòng ban không tồn tại.");

      const managerPosition = await tx.position.findUnique({
        where: { name: "Manager" },
      });
      if (!managerPosition)
        throw new Error("Không tìm thấy vị trí 'Manager' trong hệ thống.");

      const oldManagerId = existingDept.manager?.id;
      const hasManagerField = departmentData.managerId && departmentData !== "";
      const newManagerId = hasManagerField
        ? departmentData.managerId
        : oldManagerId;

      if (hasManagerField && newManagerId !== oldManagerId) {
        if (oldManagerId) {
          await tx.employee.update({
            where: { id: oldManagerId },
            data: {
              managedDepartment: { disconnect: true },
            },
          });
        }

        if (newManagerId) {
          const manager = await tx.employee.findUnique({
            where: { id: newManagerId },
            include: {
              position: true,
              department: true,
            },
          });

          if (!manager) throw new Error("Mã nhân viên không tồn tại.");

          if (manager.position?.name !== "Manager") {
            await tx.employee.update({
              where: { id: newManagerId },
              data: {
                position: { connect: { id: managerPosition.id } },
              },
            });
          }

          if (manager.departmentId && manager.departmentId !== id) {
            await tx.employee.update({
              where: { id: newManagerId },
              data: {
                department: { disconnect: true },
              },
            });
          }
        }
      }

      const updateData = {
        departmentCode: departmentData.departmentCode,
        name: departmentData.name,
        description: departmentData.description,
        foundedAt: departmentData.foundedAt,
      };

      if (hasManagerField && newManagerId !== oldManagerId) {
        updateData.manager = newManagerId
          ? { connect: { id: newManagerId } }
          : { disconnect: true };
      }

      const updatedDept = await tx.department.update({
        where: { id },
        data: updateData,
        include: { manager: true },
      });

      if (hasManagerField && newManagerId && newManagerId !== oldManagerId) {
        await tx.employee.update({
          where: { id: newManagerId },
          data: {
            department: { connect: { id } },
          },
        });
      }

      return updatedDept;
    });
  }
}

export default new DepartmentService(prisma.department);
