import BaseService from "../../core/service/baseService.js";
import { prisma } from "../../config/db.js";

class PerformanceDetailService extends BaseService {
  constructor(repository) {
    super(repository);
  }
}

export default new PerformanceDetailService(prisma.performanceReportDetail);