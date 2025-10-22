import performanceDetailService from "./performanceDetail.service.js";
import performanceCriteriaService from "./performanceCriteria.service.js";
import performanceDetailScoreService from "./performanceDetailScore.service.js";
import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";

const performanceDetailController = {
  createReportDetail: async (req, res) => {
    try {
      const performanceDetailData = {
        employeeId: req.body.employeeId,
        supervisorId: req.body.supervisorId,
        performanceReportId: req.body.performanceReportId,
        // description: req.body.description,
      }
      const newReportDetail = await performanceDetailService.create(performanceDetailData);
      res.status(200).json(new SuccessResponseDto(newReportDetail));
    } catch (error) {
      console.log("Error creating performance report detail", error);
      return res.status(500).send();
    }
  },
  getAllReportDetail: async (req, res) => {
    try {
      const reportDetails = await performanceDetailService.read();
      return res.status(200).json(new SuccessResponseDto(reportDetails));
    } catch (error) {
      console.log("Error getting performance report details", error);
      return res.status(500).send();
    }
  },
  getReportDetail: async (req, res) => {
    try {
      const reportDetailId = req.params.id;
      const reportDetail = await performanceDetailService.readById(reportDetailId);
      return res.status(200).json(new SuccessResponseDto(reportDetail));
    } catch (error) {
      console.log("Error getting performance report detail by ID", error);
      return res.status(500).send();
    }
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
  updateReportDetail: async (req, res) => {},
  deleteReportDetail: async (req, res) => {
    try {
      const reportDetailId = req.params.id;
      await performanceDetailService.delete({id: parseInt(reportDetailId)}, "hard");
      return res.status(200).json(new SuccessResponseDto({ message: "Performance report detail deleted successfully" }));
    } catch (error) {
      console.log("Error deleting performance report detail", error);
      return res.status(500).send();
    }
  }
}

export default performanceDetailController;