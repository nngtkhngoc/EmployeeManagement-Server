import { prisma } from "../config/db.js";

export const leaveApplicationService = {
  getAllLeaveApplications: async () => {
    return prisma.leaveApplication.findMany();
  },
};
