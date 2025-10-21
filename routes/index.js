import employeeRouter from "../modules/employee/employee.route.js";
import authRouter from "../modules/auth/auth.route.js";
export const routes = app => {
  app.use("/api/employee", employeeRouter);
  app.use("/api/auth", authRouter);
  app.use("/healthcheck", (req, res) => res.status(200).send("OK"));
};
