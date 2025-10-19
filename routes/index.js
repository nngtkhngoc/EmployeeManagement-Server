import employeeRouter from "../modules/employee/employee/employee.route.js";

export const routes = app => {
  app.use("/api/employee", employeeRouter);
  app.use("/healthcheck", (req, res) => res.status(200).send("OK"));
};
