import express from "express";
import performanceCriteria from "./performanceCriteria.controller.js";

const router = express.Router();

router
  .route("/")
  .get(performanceCriteria.getAllPerformanceCriteria)
  .post(performanceCriteria.createPerformanceCriteria);

router
  .route("/:id")
  .get(performanceCriteria.getPerformanceCriteria)
  .put(performanceCriteria.updatePerformanceCriteria)
  .delete(performanceCriteria.deletePerformanceCriteria);

export default router;
