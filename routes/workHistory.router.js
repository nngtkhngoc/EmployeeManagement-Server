import express from "express";
import workHistoryController from "../controllers/workHistory.controller.js";

const router = express.Router();

router
  .route("/")
  .get(workHistoryController.getAllWorkHistorys)
  .post(workHistoryController.createWorkHistory);

router
  .route("/:id")
  .get(workHistoryController.getWorkHistory)
  .put(workHistoryController.updateWorkHistory)
  .delete(workHistoryController.deleteWorkHistory);

export default router;
