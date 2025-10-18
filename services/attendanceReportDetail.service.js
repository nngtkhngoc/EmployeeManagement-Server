import { prisma } from "../config/db.js";

export const attendanceReportDetailService = {
  getAllAttendanceReportDetails: async () => {
    return prisma.attendanceReportDetail.findMany();
  },
};
