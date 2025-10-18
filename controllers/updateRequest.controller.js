import { updateRequestService } from "../services/updateRequest.service.js";

const updateRequestController = {
  getAllUpdateRequests: async (req, res) => {
    try {
      const updateRequests = await updateRequestService.getAllUpdateRequests();

      return res.status(200).json({ data: updateRequests });
    } catch (error) {
      return res.status(500).send();
    }
  },
  getUpdateRequest: async (req, res) => {},
  createUpdateRequest: async (req, res) => {
    try {
    } catch (error) {}
  },
  deleteUpdateRequest: async (req, res) => {},
  updateUpdateRequest: async (req, res) => {},
};

export default updateRequestController;
