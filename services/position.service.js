import { prisma } from "../config/db.js";

export const positionService = {
  getAllPositions: async () => {
    return prisma.position.findMany();
  },
};
