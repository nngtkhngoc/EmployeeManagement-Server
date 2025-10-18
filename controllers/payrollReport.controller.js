import { payrollReportService } from "../services/payrollReport.service.js";

const payrollReportController = {
  getAllPayrollReports: async (req, res) => {
    try {
      const payrollReports = await payrollReportService.getAllPayrollReports();

      return res.status(200).json({ data: payrollReports });
    } catch (error) {
      return res.status(500);
    }
  },
  getPayrollReport: async (req, res) => {},
  createPayrollReport: async (req, res) => {
    try {
    } catch (error) {}
  },
  deletePayrollReport: async (req, res) => {},
  updatePayrollReport: async (req, res) => {},
};

export default payrollReportController;
