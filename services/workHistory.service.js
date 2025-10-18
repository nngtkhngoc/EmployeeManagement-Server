import { prisma } from "../config/db.js";

export const workHistoryService = {
  getAllWorkHistory: async () => {
    return prisma.workHistory.findMany();
  },
};
