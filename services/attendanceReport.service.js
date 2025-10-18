import { prisma } from "../config/db.js";

export const attendanceReportService = {
  getAllAttendanceReports: async () => {
    return prisma.attendanceReport.findMany();
  },
};
