import BaseService from "../../core/service/baseService.js";
import { prisma } from "../../config/db.js";

class EmployeeService extends BaseService {
  constructor(repository) {
    super(repository);
  }
}

export default new EmployeeService(prisma.employee);
