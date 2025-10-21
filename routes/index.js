import employeeRouter from "../modules/employee/employee/employee.route.js";
import workHistoryRouter from "../modules/employee/workHistory/workHistory.route.js";
import departmentRounter from "../modules/employee/department/department.route.js";
import positionRouter from "../modules/employee/position/position.route.js";

export const routes = app => {
  app.use("/api/employee", employeeRouter);
  app.use("/api/work-history", workHistoryRouter);
  app.use("/api/department", departmentRounter);
  app.use("/api/postion", positionRouter);

  app.use("/healthcheck", (req, res) => res.status(200).send("OK"));
};
