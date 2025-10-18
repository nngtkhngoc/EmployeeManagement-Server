import { performanceCriteriaService } from "../services/performanceCriteria.service.js";

const performanceCriteriaController = {
  getAllPerformanceCriterias: async (req, res) => {
    try {
      const performanceCriterias =
        await performanceCriteriaService.getAllPerformanceCriterias();

      return res.status(200).json({ data: performanceCriterias });
    } catch (error) {
      return res.status(500);
    }
  },
  getPerformanceCriteria: async (req, res) => {},
  createPerformanceCriteria: async (req, res) => {
    try {
    } catch (error) {}
  },
  deletePerformanceCriteria: async (req, res) => {},
  updatePerformanceCriteria: async (req, res) => {},
};

export default performanceCriteriaController;
