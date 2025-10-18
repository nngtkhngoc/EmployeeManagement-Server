import { leaveTypeService } from "../services/leaveType.service.js";

const leaveTypeController = {
  getAllLeaveTypes: async (req, res) => {
    try {
      const leaveTypes = await leaveTypeService.getAllLeaveTypes();

      return res.status(200).json({ data: leaveTypes });
    } catch (error) {
      return res.status(500);
    }
  },
  getLeaveType: async (req, res) => {},
  createLeaveType: async (req, res) => {
    try {
    } catch (error) {}
  },
  deleteLeaveType: async (req, res) => {},
  updateLeaveType: async (req, res) => {},
};

export default leaveTypeController;
