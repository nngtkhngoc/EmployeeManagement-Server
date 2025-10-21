import express from "express";
import attendanceController from "./attendance.controller.js";
const router = express.Router();

router.get("/", attendanceController.getAttendanceReports);
export default router;
