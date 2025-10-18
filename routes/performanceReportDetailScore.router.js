import express from "express";
import performanceReportDetailScore from "../controllers/performanceReportDetailScore.controller.js";

const router = express.Router();

router
  .route("/")
  .get(performanceReportDetailScore.getAllPerformanceReportDetailScores)
  .post(performanceReportDetailScore.createPerformanceReportDetailScore);

router
  .route("/:id")
  .get(performanceReportDetailScore.getPerformanceReportDetailScore)
  .put(performanceReportDetailScore.updatePerformanceReportDetailScore)
  .delete(performanceReportDetailScore.deletePerformanceReportDetailScore);

export default router;
