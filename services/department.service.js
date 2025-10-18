import { prisma } from "../config/db.js";

export const departmentService = {
  getAllDepartments: async () => {
    return prisma.department.findMany();
  },
};
