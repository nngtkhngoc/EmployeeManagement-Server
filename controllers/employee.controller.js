import employeeValidation from "../validations/employee.validation.js";
import employeeService from "../services/employee.service.js";

const employeeController = {
  getAllEmployees: async (req, res) => {
    try {
      const employees = await employeeService.read();

      return res.status(200).json({ data: employees });
    } catch (error) {
      return res.status(500).send();
    }
  },

  getEmployee: async (req, res) => {},

  createEmployee: async (req, res) => {
    try {
      const value = await employeeValidation
        .createEmployeeValidate()
        .validateAsync(req.body, {
          abortEarly: false,
        });
      const employeeData = {
        fullName: value.fullName,
        avatar: value.avatar,
        gender: value.gender,
        birthday: value.birthday,
        citizenId: value.citizenId,
        phone: value.phone,
        email: value.email,
        ethnicity: value.ethnicity,
        religion: value.religion,
        education: value.education,
        major: value.major,
        siNo: value.siNo,
        hiNo: value.hiNo,
        departmentId: value.departmentId,
        positionId: value.positionId,
      };
      const newEmployee = await employeeService.createEmployee(employeeData);
      return res.status(201).json({ data: newEmployee });
    } catch (error) {
      console.log("Error create new employee ", error);
      if (
        error.message.includes("Department không tồn tại") ||
        error.message.includes("Position không tồn tại")
      ) {
        return res.status(400).json({ message: error.message });
      }
      if (error.isJoi) {
        return res.status(400).json({
          errors: error.details.map(d => d.message),
        });
      }
      return res.status(500).send();
    }
  },
  deleteEmployee: async (req, res) => {},
  updateEmployee: async (req, res) => {},
};

export default employeeController;
