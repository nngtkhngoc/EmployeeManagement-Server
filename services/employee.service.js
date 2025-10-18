import { prisma } from "../config/db.js";

export const employeeService = {
  getAllEmployees: async () => {
    return prisma.employee.findMany();
  },
  createEmployee: async (employeeData) => {
    return prisma.$transaction(async (tx) => {
      await tx.$executeRaw`LOCK TABLE "Employee" IN EXCLUSIVE MODE;`;

      const department = await tx.department.findUnique({
        where: { id: employeeData.departmentId },
      });
      if (!department) throw new Error("Department không tồn tại");

      const position = await tx.position.findUnique({
        where: { id: employeeData.positionId },
      });
      if (!position) throw new Error("Position không tồn tại");

      const count = await tx.employee.count();

      const newEmployee = await tx.employee.create({
        data: {
          ...employeeData,
          employeeCode: "",
        },
      });

      const updatedEmployee = await tx.employee.update({
        where: { id: newEmployee.id },
        data: {
          employeeCode: "EM" + (count + 1).toString().padStart(3, "0"),
        },
        include: {
          position: true,
          department: true,
        },
      });

      return updatedEmployee;
    });
  },
};
