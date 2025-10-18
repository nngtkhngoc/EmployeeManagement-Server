import { payrollReportDetailService } from "../services/payrollReportDetail.service.js";

const payrollReportDetailController = {
  getAllPayrollReportDetails: async (req, res) => {
    try {
      const payrollReportDetails =
        await payrollReportDetailService.getAllPayrollReportDetails();

      return res.status(200).json({ data: payrollReportDetails });
    } catch (error) {
      return res.status(500).send();
    }
  },
  getPayrollReportDetail: async (req, res) => {},
  createPayrollReportDetail: async (req, res) => {
    try {
    } catch (error) {}
  },
  deletePayrollReportDetail: async (req, res) => {},
  updatePayrollReportDetail: async (req, res) => {},
};

export default payrollReportDetailController;
