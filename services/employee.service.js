import { prisma } from "../config/db.js";

export const employeeService = {
  getAllEmployees: async () => {
    return prisma.employee.findMany();
  },
};
