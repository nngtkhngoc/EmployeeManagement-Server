import { leaveApplicationService } from "../services/leaveApplication.service.js";

const leaveApplicationController = {
  getAllLeaveApplications: async (req, res) => {
    try {
      const leaveApplications =
        await leaveApplicationService.getAllLeaveApplications();

      return res.status(200).json({ data: leaveApplications });
    } catch (error) {
      return res.status(500).send();
    }
  },
  getLeaveApplication: async (req, res) => {},
  createLeaveApplication: async (req, res) => {
    try {
    } catch (error) {}
  },
  deleteLeaveApplication: async (req, res) => {},
  updateLeaveApplication: async (req, res) => {},
};

export default leaveApplicationController;
