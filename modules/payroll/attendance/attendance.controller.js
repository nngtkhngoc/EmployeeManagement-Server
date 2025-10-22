import attendanceService from "./attendance.service.js";
const attendanceController = {
  getAttendanceReports: async (req, res) => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const from = req.query.from
      ? new Date(req.query.from)
      : new Date(new Date(year, month - 1, 1));
    const to = req.query.to
      ? new Date(req.query.to)
      : new Date(new Date(year, month, 0));

    const attendanceReports = await attendanceService.getAttendanceReports({
      from,
      to,
    });
    return res.status(200).json({ data: attendanceReports });
  },
};

export default attendanceController;
