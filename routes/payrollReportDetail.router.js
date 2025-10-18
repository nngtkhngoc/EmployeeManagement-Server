import express from "express";
import payrollReportDetail from "../controllers/payrollReportDetail.controller.js";

const router = express.Router();

router
  .route("/")
  .get(payrollReportDetail.getAllPayrollReportDetails)
  .post(payrollReportDetail.createPayrollReportDetail);

router
  .route("/:id")
  .get(payrollReportDetail.getPayrollReportDetail)
  .put(payrollReportDetail.updatePayrollReportDetail)
  .delete(payrollReportDetail.deletePayrollReportDetail);

export default router;
