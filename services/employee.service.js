import { hashPassword } from "../config/bcrypt.js";
import { prisma } from "../config/db.js";

export const employeeService = {
  getAllEmployees: async () => {
    return prisma.employee.findMany();
  },

  createEmployee: async (employeeData) => {
    return prisma.$transaction(async (tx) => {
      const department = await tx.department.findUnique({
        where: { id: employeeData.departmentId },
      });
      if (!department) throw new Error("Department không tồn tại");

      const position = await tx.position.findUnique({
        where: { id: employeeData.positionId },
      });
      if (!position) throw new Error("Position không tồn tại");

      const nextVal =
        await tx.$queryRaw`SELECT nextval('employee_code_seq') as seq;`;
      const seqNum = nextVal[0].seq;
      const employeeCode = "EM" + seqNum.toString().padStart(3, "0");

      const password = employeeCode + department.departmentCode;
      const hashedPassword = await hashPassword(password);

      const { departmentId, positionId } = employeeData;
      delete employeeData.departmentId;
      delete employeeData.positionId;
      const newEmployee = await tx.employee.create({
        data: {
          ...employeeData,
          position: { connect: { id: positionId } },
          department: { connect: { id: departmentId } },
          employeeCode,
          password: hashedPassword,
        },
        include: {
          position: true,
          department: true,
        },
      });

      return newEmployee;
    });
  },
};
