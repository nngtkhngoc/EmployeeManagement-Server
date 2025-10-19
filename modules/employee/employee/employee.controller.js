import { SuccessResponseDto } from "../../../common/dtos/successResponseDto.js";
import employeeValidation from "../../../validations/employee.validation.js";
import catchAsync from "../../../common/catchAsync.js";
import employeeService from "./employee.service.js";

const employeeController = {
  getAllEmployees: async (req, res) => {
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

    const respondData = {
      data: employees,
      pagination: { page, limit, total, totalPages },
    };
    return res.status(200).json(new SuccessResponseDto(respondData));
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

  updateEmployee: async (req, res) => {},
};
Object.entries(employeeController).forEach(([key, value]) => {
  employeeController[key] = catchAsync(value);
});

export default employeeController;
