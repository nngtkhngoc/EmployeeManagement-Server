import { attendanceReportService } from "../services/attendanceReport.service.js";

const attendanceReportController = {
  getAllAttendanceReports: async (req, res) => {
    try {
      const attendanceReports =
        await attendanceReportService.getAllAttendanceReports();

      return res.status(200).json({ data: attendanceReports });
    } catch (error) {
      return res.status(500).send();
    }
  },
  getAttendanceReport: async (req, res) => {},
  createAttendanceReport: async (req, res) => {
    try {
    } catch (error) {}
  },
  deleteAttendanceReport: async (req, res) => {},
  updateAttendanceReport: async (req, res) => {},
};

export default attendanceReportController;
