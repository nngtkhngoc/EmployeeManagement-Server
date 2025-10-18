import express from "express";
import attendanceReportDetailController from "../controllers/attendanceReportDetail.controller.js";

const router = express.Router();

router
  .route("/")
  .get(attendanceReportDetailController.getAllAttendanceReportDetails)
  .post(attendanceReportDetailController.createAttendanceReportDetail);

router
  .route("/:id")
  .get(attendanceReportDetailController.getAttendanceReportDetail)
  .put(attendanceReportDetailController.updateAttendanceReportDetail)
  .delete(attendanceReportDetailController.deleteAttendanceReportDetail);

export default router;
