import employeeRouter from "../modules/employee/employee/employee.route.js";
import workHistoryRouter from "../modules/employee/workHistory/workHistory.route.js";

export const routes = app => {
  app.use("/api/employee", employeeRouter);
  app.use("/api/work-history", workHistoryRouter);
  app.use("/healthcheck", (req, res) => res.status(200).send("OK"));
};
