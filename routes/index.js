import employeeRouter from "../modules/employee/employee.route.js";
import payrollRouter from "../modules/payroll/payroll.route.js";
import attendanceController from "../modules/payroll/attendance/attendance.route.js";
import attendanceReportDetailController from "../modules/payroll/attendance/attendance-report-detail/attendance-report-detail.route.js";
export const routes = app => {
  app.use("/api/employee", employeeRouter);
  app.use("/healthcheck", (req, res) => res.status(200).send("OK"));
  app.use("/api/payroll-reports", payrollRouter);
  app.use("/api/attendance-reports", attendanceController);
  app.use("/api/attendance-report-details", attendanceReportDetailController);
import leaveApplicationRouter from "../modules/leave-application/leave-application.route.js";
import leaveTypeRouter from "../modules/leave-application/leave-type/leave-type.route.js";

export const routes = app => {
  app.use("/api/employee", employeeRouter);
  app.use("/healthcheck", (req, res) => res.status(200).send("OK"));
  app.use("/api/leave-applications", leaveApplicationRouter);
  app.use("/api/leave-types", leaveTypeRouter);
};
