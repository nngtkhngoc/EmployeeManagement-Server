import express from "express";

import employeeController from "./employee.controller.js";

const router = express.Router();

router
  .route("/")
  .get(employeeController.getAllEmployees)
  .post(employeeController.createEmployee);

router
  .route("/:id")
  .get(employeeController.getEmployee)
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

export default router;
