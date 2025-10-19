import { SuccessResponseDto } from "../../../common/dtos/successResponseDto.js";
import catchAsync from "../../../common/catchAsync.js";
import workHistoryService from "./workHistory.service.js";

const workHistoryController = {
  getAllWorkHistory: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const { startDate, endDate, department, isActive } = req.query;

      const filter = {};

      //   if (fullName) {
      //     filter.fullName = {
      //       contains: fullName,
      //       mode: "insensitive",
      //     };
      //   }

      //   if (department) {
      //     filter.department = {
      //       name: {
      //         contains: department,
      //         mode: "insensitive",
      //       },
      //     };
      //   }

      //   if (position) {
      //     filter.position = {
      //       name: {
      //         contains: position,
      //         mode: "insensitive",
      //       },
      //     };
      //   }

      //   if (isActive !== undefined) {
      //     filter.isActive = isActive === "true";
      //   }

      const options = { page, limit };

      const workHistorys = await workHistoryService.read({}, options);

      return res.status(200).json(new SuccessResponseDto(workHistorys));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getWorkHistory: async (req, res) => {
    const { id } = req.params;
    const workHistory = await workHistoryService.readById(parseInt(id));

    if (!workHistory) throw new Error("WorkHistory not found");
    return res.status(200).json(new SuccessResponseDto(workHistory));
  },
};

Object.entries(workHistoryController).forEach(([key, value]) => {
  workHistoryController[key] = catchAsync(value);
});

export default workHistoryController;
