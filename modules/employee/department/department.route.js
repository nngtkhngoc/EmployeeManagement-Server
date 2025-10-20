import express from "express";
import departmentController from "./department.controller.js";

const router = express.Router();

router.route("/").get(departmentController.getAllDepartments);
//   .post(employeeController.createEmployee);

// router
//   .route("/:id")
//   .get(employeeController.getEmployee)
//   .put(employeeController.updateEmployee)
//   .delete(employeeController.deleteEmployee);

export default router;
