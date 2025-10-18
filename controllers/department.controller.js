import { departmentService } from "../services/department.service.js";

const departmentController = {
  getAllDepartments: async (req, res) => {
    try {
      const departments = await departmentService.getAllDepartments();

      return res.status(200).json({ data: departments });
    } catch (error) {
      return res.status(500).send();
    }
  },
  getDepartment: async (req, res) => {},
  createDepartment: async (req, res) => {
    try {
    } catch (error) {}
  },
  deleteDepartment: async (req, res) => {},
  updateDepartment: async (req, res) => {},
};

export default departmentController;
