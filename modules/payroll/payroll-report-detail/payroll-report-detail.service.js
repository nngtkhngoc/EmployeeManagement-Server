import { prisma } from "../../../config/db.js";
import BaseService from "../../../core/service/baseService.js";
class PayrollReportDetail extends BaseService {
  constructor(repository) {
    super(repository);
  }
}
export default new PayrollReportDetail(prisma.payrollReportDetail);
