import attendanceReportDetailService from "./attendance-report-detail.service.js";
import attendanceReportDetailValidation from "../../../../validations/attendanceReportDetail.validation.js";
const attendanceReportDetailController = {
  updateAttendanceReportDetail: async (req, res) => {
    await attendanceReportDetailValidation
      .updateValidation()
      .validateAsync(req.body);
    const { id } = req.params;
    await attendanceReportDetailService.update({ id: parseInt(id) }, req.body);
    return res
      .status(200)
      .json({ message: "Cập nhật chi tiết báo cáo thành công" });
  },
};

export default attendanceReportDetailController;
