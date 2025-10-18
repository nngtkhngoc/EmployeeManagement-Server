import express from "express";
import leaveTypeController from "../controllers/leaveType.controller.js";

const router = express.Router();

router
  .route("/")
  .get(leaveTypeController.getAllLeaveTypes)
  .post(leaveTypeController.createLeaveType);

router
  .route("/:id")
  .get(leaveTypeController.getLeaveType)
  .put(leaveTypeController.updateLeaveType)
  .delete(leaveTypeController.deleteLeaveType);

export default router;
