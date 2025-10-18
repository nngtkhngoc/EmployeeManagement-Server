import { performanceReportService } from "../services/performanceReport.service.js";

const performanceReportController = {
  getAllPerformanceReports: async (req, res) => {
    try {
      const performanceReports =
        await performanceReportService.getAllPerformanceReports();

      return res.status(200).json({ data: performanceReports });
    } catch (error) {
      return res.status(500).send();
    }
  },
  getPerformanceReport: async (req, res) => {},
  createPerformanceReport: async (req, res) => {
    try {
    } catch (error) {}
  },
  deletePerformanceReport: async (req, res) => {},
  updatePerformanceReport: async (req, res) => {},
};

export default performanceReportController;
