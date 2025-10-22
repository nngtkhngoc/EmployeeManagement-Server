import express from "express";
import authController from "./auth.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
const router = express.Router();

router.route("/sign-in").post(authController.signIn);
router.route("/sign-out").post(verifyToken, authController.signOut);
//   .post(employeeController.createEmployee);

// router
//   .route("/:id")
//   .get(employeeController.getEmployee)
//   .put(employeeController.updateEmployee)
//   .delete(employeeController.deleteEmployee);

export default router;
