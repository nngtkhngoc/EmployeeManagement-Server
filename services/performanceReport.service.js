import { prisma } from "../config/db.js";

export const performReportService = {
  getAllPerformReports: async () => {
    return prisma.performReport.findMany();
  },
};
