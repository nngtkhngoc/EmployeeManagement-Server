import { prisma } from "../config/db.js";

export const payrollReportDetailService = {
  getAllPayrollReportDetails: async () => {
    return prisma.payrollReportDetail.findMany();
  },
};
