import { prisma } from "../config/db.js";

export const contractService = {
  getAllContracts: async () => {
    return prisma.contract.findMany();
  },
};
