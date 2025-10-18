import { prisma } from "../config/db.js";

export const leaveTypeService = {
  getAllLeaveTypes: async () => {
    return prisma.leaveType.findMany();
  },
};
