import express from "express";
import authController from "./auth.controller.js";
const router = express.Router();

router.route("/").post(authController.signIn);
//   .post(employeeController.createEmployee);

// router
//   .route("/:id")
//   .get(employeeController.getEmployee)
//   .put(employeeController.updateEmployee)
//   .delete(employeeController.deleteEmployee);

export default router;
