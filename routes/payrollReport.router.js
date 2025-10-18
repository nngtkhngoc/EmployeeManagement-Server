import express from "express";
import payrollReportScore from "../controllers/payrollReportScore.controller.js";

const router = express.Router();

router
  .route("/")
  .get(payrollReportScore.getAllPayrollReportScores)
  .post(payrollReportScore.createPayrollReportScore);

router
  .route("/:id")
  .get(payrollReportScore.getPayrollReportScore)
  .put(payrollReportScore.updatePayrollReportScore)
  .delete(payrollReportScore.deletePayrollReportScore);

export default router;
