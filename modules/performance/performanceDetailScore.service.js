import BaseService from "../../core/service/baseService.js";
import { prisma } from "../../config/db.js";

class PerformanceDetailScoreService extends BaseService {
  constructor(repository) {
    super(repository);
  }
}

export default new PerformanceDetailScoreService(prisma.performanceReportDetailScore);
