import express from "express";
import leaveApplicationController from "./leave-application.controller.js";

const router = express.Router();

router
  .route("/")
  .get(leaveApplicationController.getAll)
  .post(leaveApplicationController.create);

router
  .route("/:applicationId")
  .get(leaveApplicationController.getById)
  .put(leaveApplicationController.update)
  .delete(leaveApplicationController.delete);

export default router;
