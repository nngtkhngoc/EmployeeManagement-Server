import { prisma } from "../config/db.js";

export const performReportDetailService = {
  getAllPerformReportDetails: async () => {
    return prisma.performReportDetail.findMany();
  },
};
