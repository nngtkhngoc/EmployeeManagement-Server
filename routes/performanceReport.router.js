import express from "express";
import performanceReport from "../controllers/performanceReport.controller.js";

const router = express.Router();

router
  .route("/")
  .get(performanceReport.getAllPerformanceReports)
  .post(performanceReport.createPerformanceReport);

router
  .route("/:id")
  .get(performanceReport.getPerformanceReport)
  .put(performanceReport.updatePerformanceReport)
  .delete(performanceReport.deletePerformanceReport);

export default router;
