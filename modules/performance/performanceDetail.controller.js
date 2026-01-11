import performanceDetailService from "./performanceDetail.service.js";
import performanceCriteriaService from "./performanceCriteria.service.js";
import performanceDetailScoreService from "./performanceDetailScore.service.js";
import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import catchAsync from "../../common/catchAsync.js";
import { BadRequestException } from "../../common/exceptions/exception.js";

const performanceDetailController = {
  createReportDetail: async (req, res) => {
    const { employeeId, supervisorId, performanceReportId, description } = req.body;
    const performanceDetailData = {
      employeeId,
      supervisorId,
      performanceReportId,
      description,
    };
    const newReportDetail = await performanceDetailService.create(performanceDetailData);
    res.status(201).json(new SuccessResponseDto(newReportDetail));
  },
  getAllReportDetail: async (req, res) => {
    const reportDetails = await performanceDetailService.read();
    return res.status(200).json(new SuccessResponseDto(reportDetails));
  },
  getReportDetail: async (req, res) => {
    const { id } = req.params;
    const reportDetail = await performanceDetailService.readById(parseInt(id), {
      include: {
        employee: true,
        supervisor: true,
        scores: {
          include: {
            performanceCriteria: true
          }
        }
      }
    });
    if (!reportDetail) throw new BadRequestException("Performance report detail not found");
    return res.status(200).json(new SuccessResponseDto(reportDetail));
  },
  getScore: async (req, res) => {
    try {
      const reportDetailId = req.params.id;
      const performanceCriteria = await performanceCriteriaService.read();
      let totalPoint = 0;
      for (const criteria of performanceCriteria) {
        const detailScore = await performanceDetailScoreService.read({
          where: {
            performanceReportDetailId: parseInt(reportDetailId),
            performanceCriteriaId: parseInt(criteria.id)
          }
        });
        if (detailScore) {
          // console.log(detailScore[0]);
          totalPoint += parseInt(detailScore[0].score);
        }
      }
      console.log(totalPoint);
      let score = 0.0;
      if (totalPoint < 5) {
        score = 0.7;
      } else if (totalPoint <= 6) {
        score = 0.8 + 0.2 * (totalPoint - 5);
      } else if (totalPoint <= 8) {
        score = 1.0 + 0.1 * (totalPoint - 7);
      } else {
        score = 1.1 + 0.1 * (totalPoint - 8);
      }
      const newData = await performanceDetailService.update(
        { id: parseInt(reportDetailId) },
        { average_score: score }
      );
      return res.status(200).json(new SuccessResponseDto(newData));
    } catch (error) {
      console.log("Error calculating total point for performance report detail", error);
      return res.status(500).send();
    }
  },
  updateReportDetail: async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;

    const reportDetail = await performanceDetailService.readById(parseInt(id));
    if (!reportDetail) throw new BadRequestException("Performance report detail not found");

    const updateData = {};
    if (description !== undefined) {
      updateData.description = description;
    }

    const updated = await performanceDetailService.update(
      { id: parseInt(id) },
      updateData
    );
    return res.status(200).json(new SuccessResponseDto(updated));
  },
  deleteReportDetail: async (req, res) => {
    const { id } = req.params;
    const reportDetail = await performanceDetailService.readById(parseInt(id));
    if (!reportDetail) throw new BadRequestException("Performance report detail not found");

    await performanceDetailService.delete({ id: parseInt(id) }, "hard");
    return res.status(200).json(new SuccessResponseDto({ message: "Performance report detail deleted successfully" }));
  }
}

Object.entries(performanceDetailController).forEach(([key, value]) => {
  performanceDetailController[key] = catchAsync(value);
});

export default performanceDetailController;