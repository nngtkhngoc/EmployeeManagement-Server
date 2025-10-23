import workHistoryRouter from "../modules/employee/workHistory/workHistory.route.js";
import departmentRouter from "../modules/employee/department/department.route.js";
import positionRouter from "../modules/employee/position/position.route.js";
import employeeRouter from "../modules/employee/employee/employee.route.js";
import authRouter from "../modules/auth/auth.route.js";
import updateRequestRouter from "../modules/update-request/update-request.route.js";
import payrollRouter from "../modules/payroll/payroll.route.js";
import attendanceRouter from "../modules/payroll/attendance/attendance.route.js";
import attendanceReportDetailRouter from "../modules/payroll/attendance/attendance-report-detail/attendance-report-detail.route.js";
import leaveApplicationRouter from "../modules/leave-application/leave-application.route.js";
import leaveTypeRouter from "../modules/leave-application/leave-type/leave-type.route.js";
import contractRouter from "../modules/contract/contract.route.js";
import performanceRouter from "../modules/performance/performance.route.js";
import performanceCriteriaRoute from "../modules/performance/performanceCriteria.route.js";
import performanceDetailRoute from "../modules/performance/performanceDetail.route.js";
import performanceDetailScoreRoute from "../modules/performance/performanceDetailScore.route.js";

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
  app.use("/api/work-history", workHistoryRouter);
  app.use("/api/department", departmentRouter);
  app.use("/api/postion", positionRouter);
  app.use("/api/performance", performanceRouter);
  app.use("/api/performance-criteria", performanceCriteriaRoute);
  app.use("/api/performance-detail", performanceDetailRoute);
  app.use("/api/performance-detail-score", performanceDetailScoreRoute);
};
