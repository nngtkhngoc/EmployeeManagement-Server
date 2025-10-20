import { SuccessResponseDto } from "../../../common/dtos/successResponseDto.js";
import catchAsync from "../../../common/catchAsync.js";
import workHistoryService from "./workHistory.service.js";

const workHistoryController = {
  getAllWorkHistory: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const { startDate, endDate, department, position, employee, isActive } =
        req.query;

      const filter = {};

      if (startDate) {
        filter.startDate = {
          gte: new Date(startDate),
        };
      }

      if (endDate) {
        filter.endDate = {
          lte: new Date(endDate),
        };
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

      if (employee && employee.length > 0) {
        const employeeArray = Array.isArray(employee)
          ? employee
          : employee.split(",");

        filter.employee = {
          OR: employeeArray.map(v => ({
            OR: [
              { fullName: { contains: v, mode: "insensitive" } },
              { employeeCode: { contains: v, mode: "insensitive" } },
            ],
          })),
        };
      }

      const options = { page, limit };
      const include = {
        department: true,
        position: true,
        employee: true,
      };

      const workHistorys = await workHistoryService.read(
        { where: filter, include },
        options
      );

      return res.status(200).json(new SuccessResponseDto(workHistorys));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getWorkHistory: async (req, res) => {
    const { id } = req.params;
    const workHistory = await workHistoryService.readById(parseInt(id), {
      include: {
        position: true,
        employee: true,
      },
    });

    if (!workHistory) throw new Error("WorkHistory not found");
    return res.status(200).json(new SuccessResponseDto(workHistory));
  },
};

Object.entries(workHistoryController).forEach(([key, value]) => {
  workHistoryController[key] = catchAsync(value);
});

export default workHistoryController;
