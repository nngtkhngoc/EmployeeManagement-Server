import express from "express";
import positionController from "./position.controller.js";

const router = express.Router();

router
  .route("/")
  .get(positionController.getAllPositions)
  .post(positionController.createPosition);

router
  .route("/:id")
  .get(positionController.getPosition)
  .put(positionController.updatePosition)
  .delete(positionController.deletePosition);

export default router;
