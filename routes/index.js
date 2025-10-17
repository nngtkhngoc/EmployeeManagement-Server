import authRouter from "./auth.router.js";
import employeeRouter from "./employee.router.js";

export const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/employee", employeeRouter);
};
