import express from "express";
import payrollController from "./payroll.controller.js";
const router = express.Router();

router.route("/").get(payrollController.getPayrollReports);
router.route("/").post(payrollController.createPayrollReport);
router.route("/:id").delete(payrollController.deletePayrollReportById);
router
  .route("/employee/:employeeId")
  .get(payrollController.getPayrollReportsByEmployeeId);

export default router;
