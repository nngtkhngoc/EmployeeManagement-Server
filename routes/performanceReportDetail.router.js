import express from "express";
import performanceReportDetail from "../controllers/performanceReportDetail.controller.js";

const router = express.Router();

router
  .route("/")
  .get(performanceReportDetail.getAllPerformanceReportDetails)
  .post(performanceReportDetail.createPerformanceReportDetail);

router
  .route("/:id")
  .get(performanceReportDetail.getPerformanceReportDetail)
  .put(performanceReportDetail.updatePerformanceReportDetail)
  .delete(performanceReportDetail.deletePerformanceReportDetail);

export default router;
