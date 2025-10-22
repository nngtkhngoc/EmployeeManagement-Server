import express from "express";
import attendanceReportDetailController from "./attendance-report-detail.controller.js";
const router = express.Router();

router
  .route("/:id")
  .put(attendanceReportDetailController.updateAttendanceReportDetail);

export default router;
