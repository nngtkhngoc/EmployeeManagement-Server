import { performanceReportDetailService } from "../services/performanceReportDetail.service.js";

const performanceReportDetailController = {
  getAllPerformanceReportDetails: async (req, res) => {
    try {
      const performanceReportDetails =
        await performanceReportDetailService.getAllPerformanceReportDetails();

      return res.status(200).json({ data: performanceReportDetails });
    } catch (error) {
      return res.status(500);
    }
  },
  getPerformanceReportDetail: async (req, res) => {},
  createPerformanceReportDetail: async (req, res) => {
    try {
    } catch (error) {}
  },
  deletePerformanceReportDetail: async (req, res) => {},
  updatePerformanceReportDetail: async (req, res) => {},
};

export default performanceReportDetailController;
