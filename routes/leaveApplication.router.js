import express from "express";
import leaveApplicationController from "../controllers/leaveApplication.controller.js";

const router = express.Router();

router
  .route("/")
  .get(leaveApplicationController.getAllLeaveApplications)
  .post(leaveApplicationController.createLeaveApplication);

router
  .route("/:id")
  .get(leaveApplicationController.getLeaveApplication)
  .put(leaveApplicationController.updateLeaveApplication)
  .delete(leaveApplicationController.deleteLeaveApplication);

export default router;
