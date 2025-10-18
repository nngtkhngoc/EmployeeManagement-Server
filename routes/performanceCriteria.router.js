import express from "express";
import performanceCriteria from "../controllers/performanceCriteria.controller.js";

const router = express.Router();

router
  .route("/")
  .get(performanceCriteria.getAllPerformanceCriterias)
  .post(performanceCriteria.createPerformanceCriteria);

router
  .route("/:id")
  .get(performanceCriteria.getPerformanceCriteria)
  .put(performanceCriteria.updatePerformanceCriteria)
  .delete(performanceCriteria.deletePerformanceCriteria);

export default router;
