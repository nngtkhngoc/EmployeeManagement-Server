import { attendanceReportDetailService } from "../services/attendanceReportDetail.service.js";

const attendanceReportDetailController = {
  getAllAttendanceReportDetails: async (req, res) => {
    try {
      const attendanceReportDetails =
        await attendanceReportDetailService.getAllAttendanceReportDetails();

      return res.status(200).json({ data: attendanceReportDetails });
    } catch (error) {
      return res.status(500);
    }
  },
  getAttendanceReportDetail: async (req, res) => {},
  createAttendanceReportDetail: async (req, res) => {
    try {
    } catch (error) {}
  },
  deleteAttendanceReportDetail: async (req, res) => {},
  updateAttendanceReportDetail: async (req, res) => {},
};

export default attendanceReportDetailController;
