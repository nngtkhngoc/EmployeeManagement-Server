import { positionService } from "../services/position.service.js";

const positionController = {
  getAllPositions: async (req, res) => {
    try {
      const positions = await positionService.getAllPositions();

      return res.status(200).json({ data: positions });
    } catch (error) {
      return res.status(500);
    }
  },
  getPosition: async (req, res) => {},
  createPosition: async (req, res) => {
    try {
    } catch (error) {}
  },
  deletePosition: async (req, res) => {},
  updatePosition: async (req, res) => {},
};

export default positionController;
