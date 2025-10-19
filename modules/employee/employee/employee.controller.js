import employeeValidation from "../../../validations/employee.validation.js";
import employeeService from "./employee.service.js";

const employeeController = {
  getAllEmployees: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;

      const { name, department, position, isActive } = req.query;

      const filter = {};

      if (name) {
        filter.fullName = {
          contains: name,
          mode: "insensitive",
        };
      }

      if (department) {
        filter.department = {
          name: {
            contains: department,
            mode: "insensitive",
          },
        };
      }

      if (position) {
        filter.position = {
          name: {
            contains: position,
            mode: "insensitive",
          },
        };
      }

      if (isActive !== undefined) {
        filter.isActive = isActive === "true";
      }

      const total = await employeeService.repository.count({ where: filter });
      const totalPages = Math.ceil(total / limit);

      const skip = (page - 1) * limit;

      const employees = await employeeService.read({
        where: filter,
        skip,
        take: limit,
        include: {
          department: true,
          position: true,
          managedDepartment: true,
          contractsAsSigner: true,
          contractsSigned: true,
          workHistory: true,
          leaveApplications: true,
          updateRequestsMade: true,
          updateRequestsReviewed: true,
          payrollDetails: true,
          attendanceDetails: true,
          performanceDetails: true,
          supervisedReports: true,
        },
        orderBy: [{ fullName: "desc" }, { createdAt: "desc" }],
      });

      return res.status(200).json({
        success: true,
        message: "Employees retrieved successfully",
        data: employees,
        pagination: { page, limit, total, totalPages },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Error fetching employees",
      });
    }
  },

  getEmployee: async (req, res) => {
    const { id } = req.params;
    try {
      const employee = await employeeService.readById(parseInt(id));

      if (employee) {
        return res.status(200).json({ data: employee });
      }

      return res.status(404).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  },

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
      const newEmployee = await employeeService.create(employeeData);
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
