import employeeRouter from "../modules/employee/employee.route.js";
import contractRouter from "../modules/contract/contract.route.js";
export const routes = app => {
  app.use("/api/employee", employeeRouter);
  app.use("/api/contract", contractRouter);
  app.use("/healthcheck", (req, res) => res.status(200).send("OK"));
};
