import employeeRouter from "../modules/employee/employee.route.js";
import leaveApplicationRouter from "../modules/leave-application/leave-application.route.js";
import updateRequestRouter from "../modules/update-request/update-request.route.js";

import contractRouter from "../modules/contract/contract.route.js";
export const routes = app => {
  app.use("/api/employee", employeeRouter);
  app.use("/api/contract", contractRouter);
  app.use("/healthcheck", (req, res) => res.status(200).send("OK"));
  app.use("/api/leave-application", leaveApplicationRouter);
  app.use("/api/update-request", updateRequestRouter);
};
