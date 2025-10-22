import payrollService from "./payroll.service.js";

const payrollController = {
  getPayrollReportsByEmployeeId: async (req, res) => {
    const { employeeId } = req.params;
    const salaries = await payrollService.getSalariesByEmployeeId({
      employeeId,
    });
    return res.status(200).json({
      data: salaries,
    });
  },

  getPayrollReports: async (req, res) => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const from = req.query.from
      ? new Date(req.query.from)
      : new Date(new Date(year, month - 1, 1));
    const to = req.query.to
      ? new Date(req.query.to)
      : new Date(new Date(year, month, 0));

    const payrollReports = await payrollService.getPayrollReports({ from, to });
    return res.status(200).json({
      data: payrollReports,
    });
  },
  createPayrollReport: async (req, res) => {
    const payrollReport = await payrollService.createPayrollReport();
    return res.status(201).json({ data: payrollReport });
  },
  deletePayrollReportById: async (req, res) => {
    const { id } = req.params;
    await payrollService.deletePayrollReportById(id);
    return res.status(203).json({
      message: "Xóa báo cáo lương thành công",
    });
  },
};

export default payrollController;
