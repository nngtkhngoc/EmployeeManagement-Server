import { employeeService } from "../services/employee.service.js";

const employeeController = {
  getAllEmployees: async (req, res) => {
    console.log("test");
    try {
      const employees = await employeeService.getAllEmployees();

      return res.status(200).json({ data: employees });
    } catch (error) {
      return res.status(500);
    }
  },
  getEmployee: async (req, res) => {},
  createEmployee: async (req, res) => {},
  deleteEmployee: async (req, res) => {},
  updateEmployee: async (req, res) => {},
};
export default employeeController;
