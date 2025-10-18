import { performanceReportDetailScoreService } from "../services/performanceReportDetailScore.service.js";

const performanceReportDetailScoreController = {
  getAllPerformanceReportDetailScores: async (req, res) => {
    try {
      const performanceReportDetailScores =
        await performanceReportDetailScoreService.getAllPerformanceReportDetailScores();

      return res.status(200).json({ data: performanceReportDetailScores });
    } catch (error) {
      return res.status(500).send();
    }
  },
  getPerformanceReportDetailScore: async (req, res) => {},
  createPerformanceReportDetailScore: async (req, res) => {
    try {
    } catch (error) {}
  },
  deletePerformanceReportDetailScore: async (req, res) => {},
  updatePerformanceReportDetailScore: async (req, res) => {},
};

export default performanceReportDetailScoreController;
