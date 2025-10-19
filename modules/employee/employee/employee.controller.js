import { SuccessResponseDto } from "../../../common/dtos/successResponseDto.js";
import employeeValidation from "../../../validations/employee.validation.js";
import catchAsync from "../../../common/catchAsync.js";
import employeeService from "./employee.service.js";

const employeeController = {
  getAllEmployees: async (req, res) => {
    try {
      const {
        department,
        position,
        isActive,
        page: tmpPage,
        limit: tmpLimit,
        ...personalInfor
      } = req.query;
      const page = parseInt(tmpPage) || 1;
      const limit = parseInt(tmpLimit) || 100;

      const filter = {};

      Object.entries(personalInfor).forEach(([key, value]) => {
        if (value) {
          const valueArray = Array.isArray(value) ? value : value.split(",");
          filter.OR = valueArray.map(v => ({
            [key]: {
              contains: v,
              mode: "insensitive",
            },
          }));
        }
      });

      if (isActive !== undefined) {
        filter.isActive = isActive === "true";
      }

      if (department && department.length > 0) {
        const departmentArray = Array.isArray(department)
          ? department
          : department.split(",");
        filter.department = {
          OR: departmentArray.map(v => ({
            OR: [
              { name: { contains: v, mode: "insensitive" } },
              { departmentCode: { contains: v, mode: "insensitive" } },
            ],
          })),
        };
      }

      if (position && position.length > 0) {
        const positionArray = Array.isArray(position)
          ? position
          : position.split(",");
        filter.position = {
          name: {
            in: positionArray,
            mode: "insensitive",
          },
        };
      }

      const options = { page, limit };
      const where = filter;
      const include = {
        department: true,
        position: true,
      };
      const employees = await employeeService.read(
        { where, include },
        {
          options,
        }
      );

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
