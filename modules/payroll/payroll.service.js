import BaseService from "../../core/service/baseService.js";
import attendanceService from "./attendance/attendance.service.js";
import payrollReportDetailService from "./payroll-report-detail/payroll-report-detail.service.js";
import attendanceReportDetailService from "./attendance/attendance-report-detail/attendance-report-detail.service.js";
import { prisma } from "../../config/db.js";
import _ from "lodash";

class PayrollService extends BaseService {
  performanceReportDetailService;

  attendanceReportDetailService;
  attendanceService;

  payrollReportDetailService;

  leaveApplicationService;

  contractService;

  employeeService;

  constructor() {
    super(prisma.payrollReport);
    this.contractService = new BaseService(prisma.contract);
    this.leaveApplicationService = new BaseService(prisma.leaveApplication);
    this.employeeService = new BaseService(prisma.employee);
    this.attendanceService = attendanceService;
    this.payrollReportDetailService = payrollReportDetailService;
    this.performanceReportDetailService = new BaseService(
      prisma.performanceReportDetail
    );
    this.attendanceReportDetailService = attendanceReportDetailService;
  }

  async calculateSalaryForEmployee({ employeeId, month, year }) {
    const contract = await this.contractService.readOne({
      where: { employeeId: employeeId, status: "ACTIVE" },
    });
    if (!contract) return 0;
    const { overLeaveDays } =
      await this.attendanceService.getOverLeaveDaysAndLeaveDays({
        employeeId,
        month,
        year,
      });
    const totalSalary =
      (this.DAY_IN_MONTH - overLeaveDays) * contract.dailySalary;
    return totalSalary;
  }
  async getSalariesByEmployeeId({ employeeId }) {
    const payrolls = await this.read({
      where: {
        details: {
          some: { employeeId: parseInt(employeeId) },
        },
      },
      include: {
        details: true,
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
    return payrolls.data;
  }
  /**
   *
   * @param {Date} from - start date
   * @param {Date} to - end date
   */
  async getPayrollReports({ from, to }) {
    const payrollReports = await this.read({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      include: {
        details: {
          include: {
            employee: true,
            attendanceReportDetail: true,
            performanceReportDetail: true,
          },
        },
      },
    });
    return payrollReports.data;
  }
  async deletePayrollReports({ month, year }) {
    await prisma.$transaction([
      this.attendanceService.deleteMany({
        month,
        year,
      }),
      this.deleteMany({
        month,
        year,
      }),
    ]);
  }
  async deletePayrollReportById(id) {
    const record = await this.readOne({
      where: {
        id: parseInt(id),
      },
    });
    if (!record) {
      throw new Error("Báo cáo lương không tồn tại");
    }
    console.log(this.attendanceService);

    await this.delete({
      id: parseInt(id),
    });
    await this.attendanceService.deleteMany({
      month: record.month,
      year: record.year,
    });
  }
  async createPayrollReport() {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    let payroll = await this.readOne({
      where: {
        month,
        year,
      },
    });
    if (!payroll) {
      payroll = await this.create({
        month,
        year,
      });
    } else {
      throw new Error("Đã tạo báo cáo lương cho tháng này rồi");
    }
    // create attendance report
    await this.attendanceService.createAttendanceReport({
      month,
      year,
    });
    const employees = await this.employeeService.read({
      where: {
        NOT: {
          workStatus: {
            in: ["RETIRED", "TERMINATED", "RESIGNED"],
          },
        },
      },
    });

    for (const employee of employees.data) {
      let existing = await this.payrollReportDetailService.readOne({
        where: {
          employeeId: employee.id,
          payrollReportId: payroll.id,
        },
      });
      if (existing) continue;

      const contract = await this.contractService.readOne({
        where: { employeeId: employee.id, status: "ACTIVE" },
      });
      if (!contract) continue;

      const performanceDetails =
        await this.performanceReportDetailService.readOne({
          where: {
            employeeId: employee.id,
            performanceReport: {
              month,
              year,
            },
          },
        });

      const totalSalary = await this.calculateSalaryForEmployee({
        employeeId: employee.id,
        month,
        year,
      });

      const basicSalary = contract.dailySalary * this.DAY_IN_MONTH;
      const deductions = basicSalary - totalSalary || 0;
      const allowances = contract?.allowances || 0;
      const performanceRatio = performanceDetails?.average_score || 1.0;
      const attendanceReportDetail =
        await this.attendanceReportDetailService.readOne({
          where: {
            employeeId: employee.id,
            attendanceReport: {
              month,
              year,
            },
          },
        });

      if (!attendanceReportDetail) continue;
      if (!performanceDetails) continue;

      const detail = await this.payrollReportDetailService.create({
        deductions,
        allowances,
        basicSalary,
        totalSalary,
        performanceRatio,
        attendanceReportDetail: {
          connect: {
            id: attendanceReportDetail.id,
          },
        },
        employee: {
          connect: {
            id: employee.id,
          },
        },
        payrollReport: {
          connect: {
            id: payroll.id,
          },
        },
        performanceReportDetail: {
          connect: {
            id: performanceDetails.id,
          },
        },
      });
    }
    return payroll;
  }
}

export default new PayrollService();
