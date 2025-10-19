import employeeRouter from "../modules/employee/employee.route.js";
import leaveApplicationRouter from "../modules/leave-application/leave-application.route.js";

export const routes = app => {
  app.use("/api/employee", employeeRouter);
  app.use("/healthcheck", (req, res) => res.status(200).send("OK"));
  app.use("/api/leave-application", leaveApplicationRouter);
};
