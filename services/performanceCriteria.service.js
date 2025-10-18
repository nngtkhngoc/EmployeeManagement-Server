import { prisma } from "../config/db.js";

export const performCriteriaService = {
  getAllPerformCriterias: async () => {
    return prisma.performCriteria.findMany();
  },
};
