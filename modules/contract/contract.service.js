import BaseService from "../../core/service/baseService.js";
import { prisma } from "../../config/db.js";

class ContractService extends BaseService {
  constructor(repository) {
    super(repository);
  }
}

export default new ContractService(prisma.contract);
