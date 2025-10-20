import { SuccessResponseDto } from "../../../common/dtos/successResponseDto.js";
import catchAsync from "../../../common/catchAsync.js";
import departmentService from "./department.service.js";
import employeeService from "../employee/employee.service.js";
import departmentValidation from "../../../validations/department.validation.js";

const departmentController = {
  getAllDepartments: async (req, res) => {
    try {
      const { page: tmpPage, limit: tmpLimit, ...departmentInfor } = req.query;
      const page = parseInt(tmpPage) || 1;
      const limit = parseInt(tmpLimit) || 100;

      const filter = {};

      Object.entries(departmentInfor).forEach(([key, value]) => {
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

      const options = { page, limit };
      const where = filter;
      const include = {
        manager: true,
        employees: true,
      };
      const departments = await departmentService.read(
        { where, include },
        {
          options,
        }
      );

      return res.status(200).json(new SuccessResponseDto(departments));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getDepartment: async (req, res) => {
    const { id } = req.params;
    const department = await departmentService.readById(parseInt(id));

    if (!department) throw new Error("Phòng ban không tồn tại.");
    return res.status(200).json(new SuccessResponseDto(department));
  },

  createDepartment: async (req, res) => {
    const value = await departmentValidation
      .createDepartmentValidate()
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const departmentData = {
      departmentCode: value.departmentCode,
      name: value.name,
      foundedAt: value.foundedAt,
      description: value.description,
      managerId: value.managerId,
    };

    const newDepartment = await departmentService.create(departmentData);

    return res.status(201).json(new SuccessResponseDto(newDepartment));
  },

  deleteDepartment: async (req, res) => {
    const existingDept = await departmentService.readById(
      parseInt(req.params.id)
    );
    if (!existingDept) throw new Error("Phòng ban không tồn tại.");

    await departmentService.delete({ id: parseInt(req.params.id) });

    return res.status(204).json(new SuccessResponseDto(""));
  },

  updateDepartment: async (req, res) => {
    const value = await departmentValidation
      .updateDepartmentValidate()
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const departmentData = {
      departmentCode: value.departmentCode,
      name: value.name,
      foundedAt: value.foundedAt,
      description: value.description,
      managerId: value.managerId,
    };

    const updatedDepartment = await departmentService.update(
      parseInt(req.params.id),
      departmentData
    );

    return res.status(200).json(new SuccessResponseDto(updatedDepartment));
  },
};

Object.entries(departmentController).forEach(([key, value]) => {
  departmentController[key] = catchAsync(value);
});

export default departmentController;
