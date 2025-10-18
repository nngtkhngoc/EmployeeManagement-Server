import { workHistoryService } from "../services/workHistory.service.js";

const workHistoryController = {
  getAllWorkHistorys: async (req, res) => {
    try {
      const workHistorys = await workHistoryService.getAllWorkHistorys();

      return res.status(200).json({ data: workHistorys });
    } catch (error) {
      return res.status(500).send();
    }
  },
  getWorkHistory: async (req, res) => {},
  createWorkHistory: async (req, res) => {
    try {
    } catch (error) {}
  },
  deleteWorkHistory: async (req, res) => {},
  updateWorkHistory: async (req, res) => {},
};

export default workHistoryController;
