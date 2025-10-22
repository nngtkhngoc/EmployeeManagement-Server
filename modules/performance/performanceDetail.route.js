import express from "express";
import performanceDetailController from "./performanceDetail.controller.js";

const router = express.Router();

router
  .route("/")
  .get(performanceDetailController.getAllReportDetail)
  .post(performanceDetailController.createReportDetail);

router
  .route("/:id")
  .get(performanceDetailController.getReportDetail)
  .put(performanceDetailController.updateReportDetail)
  .delete(performanceDetailController.deleteReportDetail);

router
  .route("/score/:id")
  .get(performanceDetailController.getScore);

export default router;
