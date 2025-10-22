import { prisma } from "../../../config/db.js";
import BaseService from "../../../core/service/baseService.js";

class LeaveTypeService extends BaseService {
  constructor(repository) {
    super(repository);
  }
}

export default new LeaveTypeService(prisma.leaveType);
