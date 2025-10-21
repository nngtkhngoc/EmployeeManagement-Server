import BaseService from "../../../core/service/baseService.js";
import { prisma } from "../../../config/db.js";

class PositionService extends BaseService {
  constructor(repository) {
    super(repository);
  }
}

export default new PositionService(prisma.position);
