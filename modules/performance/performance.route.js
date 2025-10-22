import express from "express";
import performanceController from "./performance.controller.js";

const router = express.Router();

router
  .route("/")
  .get(performanceController.getAllReport)
  .post(performanceController.createReport);

router
  .route("/:id")
  .get(performanceController.getReport)
  .put(performanceController.updateReport)
  .delete(performanceController.deleteReport);

export default router;
