import express from "express";
import performanceDetailScoreController from "./performanceDetailScore.controller.js";

const router = express.Router();

router
  .route("/")
  .get(performanceDetailScoreController.getAllPerformanceDetailScores)
  .post(performanceDetailScoreController.createPerformanceDetailScores);

router
  .route("/:id")
  .get(performanceDetailScoreController.getPerformanceDetailScore)
  .put(performanceDetailScoreController.updatePerformanceDetailScores)
  .delete(performanceDetailScoreController.deletePerformanceDetailScores);

export default router;
