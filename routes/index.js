import employeeRouter from "../modules/employee/employee.route.js";
import leaveApplicationRouter from "../modules/leave-application/leave-application.route.js";
import leaveTypeRouter from "../modules/leave-application/leave-type/leave-type.route.js";

export const routes = app => {
  app.use("/api/employee", employeeRouter);
  app.use("/healthcheck", (req, res) => res.status(200).send("OK"));
  app.use("/api/leave-applications", leaveApplicationRouter);
  app.use("/api/leave-types", leaveTypeRouter);
};
