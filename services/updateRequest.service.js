import { prisma } from "../config/db.js";

export const updateRequestService = {
  getAllUpdateRequests: async () => {
    return prisma.updateRequest.findMany();
  },
};
