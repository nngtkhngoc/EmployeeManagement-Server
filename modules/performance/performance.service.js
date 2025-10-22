import { prisma } from "../../config/db.js";
import BaseService from "../../core/service/baseService.js";

class PerformanceService extends BaseService {
  constructor(repository) {
    super(repository);
  }
}

export default new PerformanceService(prisma.performanceReport);

