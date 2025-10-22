import _ from "lodash";
import BaseService from "../../../core/service/baseService.js";
import { prisma } from "../../../config/db.js";
import { differenceInCalendarDays } from "date-fns";
class AttendanceService extends BaseService {
  employeeService;

  constructor() {
    super(prisma.attendanceReport);
    this.employeeService = new BaseService(prisma.employee);
  }
  async getOverLeaveDaysAndLeaveDays({ employeeId, month, year }) {
    const lastDayOfMonth = new Date(year, month, 0);
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const applications = await prisma.leaveApplication.findMany({
      where: {
        employeeId,
        status: "APPROVED",
        NOT: {
          OR: [
            { startDate: { gt: lastDayOfMonth } },
            { endDate: { lt: firstDayOfMonth } },
          ],
        },
      },
      include: {
        leaveType: true,
      },
    });
    const group = _.groupBy(applications, app => app.leaveTypeId);
    let overLeaveDays = 0;
    let leaveDays = 0;

    for (const [key, data] of Object.entries(group)) {
      let total = 0;

      for (const application of data) {
        const startDate =
          new Date(application.startDate) < firstDayOfMonth
            ? firstDayOfMonth
            : new Date(application.startDate);

        const endDate =
          new Date(application.endDate) < lastDayOfMonth
            ? new Date(application.endDate)
            : lastDayOfMonth;
        total += differenceInCalendarDays(endDate, startDate) + 1;
      }
      overLeaveDays += Math.max(0, total - data[0].leaveType.maxDays);
      leaveDays += total;
      console.log(data[0].leaveType.maxDays, total);
    }
    console.log("overLeaveDays", employeeId, leaveDays, overLeaveDays);
    return {
      overLeaveDays,
      leaveDays,
    };
  }
  /**
   *
   * @param {Date} from - start date
   * @param {Date} to - end date
   */
  async getAttendanceReports({ from, to }) {
    const attendanceReports = await this.read({
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
          },
        },
      },
    });
    return attendanceReports.data;
  }
  async createAttendanceReport({ month, year }) {
    let attendanceReport = await prisma.attendanceReport.findFirst({
      where: {
        month,
        year,
      },
    });
    if (!attendanceReport) {
      attendanceReport = await prisma.attendanceReport.create({
        data: {
          month,
          year,
        },
      });
    } else {
      throw new Error("Đã tạo báo cáo chấm công cho tháng này rồi");
    }
    const employees = await this.employeeService.read({
      where: {
        NOT: {
          workStatus: {
            in: ["RESIGNED", "TERMINATED", "RETIRED"],
          },
        },
      },
    });
    for (const employee of employees.data) {
      const { overLeaveDays, leaveDays } =
        await this.getOverLeaveDaysAndLeaveDays({
          employeeId: employee.id,
          month,
          year,
        });
      let attendanceReportDetail =
        await prisma.attendanceReportDetail.findFirst({
          where: {
            attendanceReportId: attendanceReport.id,
            employeeId: employee.id,
          },
        });
      if (!attendanceReportDetail) {
        attendanceReportDetail = await prisma.attendanceReportDetail.create({
          data: {
            attendanceReportId: attendanceReport.id,
            employeeId: employee.id,
            overLeaveDays,
            leaveDays,
          },
        });
      }
      console.log(attendanceReportDetail);
    }
  }
}
export default new AttendanceService(prisma.attendanceReport);
