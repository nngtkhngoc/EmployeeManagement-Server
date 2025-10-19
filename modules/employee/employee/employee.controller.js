import { SuccessResponseDto } from "../../../common/dtos/successResponseDto.js";
import employeeValidation from "../../../validations/employee.validation.js";
import catchAsync from "../../../common/catchAsync.js";
import employeeService from "./employee.service.js";

const employeeController = {
  getAllEmployees: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const { fullName, department, position, isActive } = req.query;

      const filter = {};

      if (fullName) {
        filter.fullName = {
          contains: fullName,
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

      const options = { page, limit };

      const employees = await employeeService.read({ where: filter }, options);

      return res.status(200).json(new SuccessResponseDto(employees));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getEmployee: async (req, res) => {
    const { id } = req.params;
    const employee = await employeeService.readById(parseInt(id));

    if (!employee) throw new Error("Employee not found");
    return res.status(200).json(new SuccessResponseDto(employee));
  },

  createEmployee: async (req, res) => {
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

    return res.status(201).json(new SuccessResponseDto(newEmployee));
  },

  deleteEmployee: async (req, res) => {},

  updateEmployee: async (req, res) => {
    const value = await employeeValidation
      .updateEmployeeValidate()
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
      workStatus: value.workStatus,
    };

    const updatedEmployee = await employeeService.update(
      parseInt(req.params.id),
      employeeData
    );

    return res.status(200).json(new SuccessResponseDto(updatedEmployee));
  },
};

Object.entries(employeeController).forEach(([key, value]) => {
  employeeController[key] = catchAsync(value);
});

export default employeeController;
