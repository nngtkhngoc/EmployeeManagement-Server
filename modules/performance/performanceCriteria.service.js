import BaseService from "../../core/service/baseService.js";
import { prisma } from "../../config/db.js";

class PerformanceCriteriaService extends BaseService {
  constructor(repository) {
    super(repository);
  }
}

export default new PerformanceCriteriaService(prisma.performanceCriteria);
