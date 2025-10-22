import employeeRouter from "../modules/employee/employee.route.js";
import authRouter from "../modules/auth/auth.route.js";
import updateRequestRouter from "../modules/update-request/update-request.route.js";
import payrollRouter from "../modules/payroll/payroll.route.js";
import attendanceRouter from "../modules/payroll/attendance/attendance.route.js";
import attendanceReportDetailRouter from "../modules/payroll/attendance/attendance-report-detail/attendance-report-detail.route.js";
import leaveApplicationRouter from "../modules/leave-application/leave-application.route.js";
import leaveTypeRouter from "../modules/leave-application/leave-type/leave-type.route.js";
import contractRouter from "../modules/contract/contract.route.js";

export const routes = app => {
  app.use("/healthcheck", (req, res) => res.status(200).send("OK"));
  
  app.use("/api/employee", employeeRouter);
  app.use("/api/contract", contractRouter);
  app.use("/api/update-request", updateRequestRouter);
  app.use("/api/leave-applications", leaveApplicationRouter);
  app.use("/api/leave-types", leaveTypeRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/attendance-reports", attendanceRouter);
  app.use("/api/payroll-reports", payrollRouter);
  app.use("/api/attendance-report-details", attendanceReportDetailRouter);
};
