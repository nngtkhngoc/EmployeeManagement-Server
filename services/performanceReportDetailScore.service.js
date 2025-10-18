import { prisma } from "../config/db.js";

export const performReportDetailScoreService = {
  getAllPerformReportDetailScores: async () => {
    return prisma.performReportDetailScore.findMany();
  },
};
