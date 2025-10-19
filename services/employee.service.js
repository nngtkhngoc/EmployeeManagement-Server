import BaseService from "../common/service/baseService.js";
import { hashPassword } from "../config/bcrypt.js";
import { prisma } from "../config/db.js";

class EmployeeService extends BaseService {
  constructor(repository) {
    super(repository);
  }
}

export default new EmployeeService(prisma.employee);
