import express from "express";
import attendanceReportController from "../controllers/attendanceReport.controller.js";

const router = express.Router();

router
  .route("/")
  .get(attendanceReportController.getAllAttendanceReports)
  .post(attendanceReportController.createAttendanceReport);

router
  .route("/:id")
  .get(attendanceReportController.getAttendanceReport)
  .put(attendanceReportController.updateAttendanceReport)
  .delete(attendanceReportController.deleteAttendanceReport);

export default router;
