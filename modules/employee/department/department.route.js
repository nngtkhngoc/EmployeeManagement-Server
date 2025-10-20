import express from "express";
import departmentController from "./department.controller.js";

const router = express.Router();

router
  .route("/")
  .get(departmentController.getAllDepartments)
  .post(departmentController.createDepartment);

router
  .route("/:id")
  .get(departmentController.getDepartment)
  .put(departmentController.updateDepartment)
  .delete(departmentController.deleteDepartment);

export default router;
