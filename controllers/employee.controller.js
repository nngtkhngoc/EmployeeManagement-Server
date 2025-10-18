import { employeeService } from "../services/employee.service.js";

const employeeController = {
  getAllEmployees: async (req, res) => {
    try {
      const employees = await employeeService.getAllEmployees();

      return res.status(200).json({ data: employees });
    } catch (error) {
      return res.status(500);
    }
  },
  getEmployee: async (req, res) => {},
  createEmployee: async (req, res) => {
    // const {fullName, avatar, gender, birthday, citizenId, phone, email, ethnicity, religion, education, major, siNo, hiNo}
    try {
    } catch (error) {}
  },
  deleteEmployee: async (req, res) => {},
  updateEmployee: async (req, res) => {},
};

export default employeeController;
