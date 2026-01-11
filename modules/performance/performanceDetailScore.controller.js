import performanceDetailScoreService from "./performanceDetailScore.service.js";
import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import catchAsync from "../../common/catchAsync.js";
import { BadRequestException } from "../../common/exceptions/exception.js";

const performanceDetailScoreController = {
  createPerformanceDetailScores: async (req, res) => {
    try {
      const performanceDetailScoresData = {
        performanceReportDetailId: req.body.performanceReportDetailId,
        performanceCriteriaId: req.body.performanceCriteriaId,
        score: req.body.score
      }
      const newPerformanceDetailScores = await performanceDetailScoreService.create(performanceDetailScoresData);
      return res.status(200).json(new SuccessResponseDto(newPerformanceDetailScores));
    } catch (error) {
      console.log("Error creating performance detail scores", error);
      return res.status(500).send();
    }
  },
  getAllPerformanceDetailScores: async (req, res) => {
    try {
      const performanceDetailScores = await performanceDetailScoreService.read();
      return res.status(200).json(new SuccessResponseDto(performanceDetailScores));
    } catch (error) {
      console.log("Error getting performance detail scores", error);
      return res.status(500).send();
    }
  },
  getPerformanceDetailScore: async (req, res) => {
    try {
      const performanceDetailScoreId = req.params.id;
      const performanceDetailScore = await performanceDetailScoreService.readById(performanceDetailScoreId);
      return res.status(200).json(new SuccessResponseDto(performanceDetailScore));
    } catch (error) {
      console.log("Error getting performance detail score by ID", error);
      return res.status(500).send();
    }
  },
  updatePerformanceDetailScores: async (req, res) => {
    const { id } = req.params;
    const { performanceCriteriaId, score } = req.body;

    const performanceDetailScore = await performanceDetailScoreService.readById(parseInt(id));
    if (!performanceDetailScore) {
      throw new BadRequestException("Performance detail score not found");
    }

    const updatedData = {};
    if (performanceCriteriaId !== undefined) {
      updatedData.performanceCriteriaId = performanceCriteriaId;
    }
    if (score !== undefined) {
      updatedData.score = score;
    }

    const updated = await performanceDetailScoreService.update(
      { id: parseInt(id) },
      updatedData
    );
    return res.status(200).json(new SuccessResponseDto(updated));
  },
  deletePerformanceDetailScores: async (req, res) => {
    try {
      const performanceDetailScoreId = req.params.id;
      await performanceDetailScoreService.delete({id: parseInt(performanceDetailScoreId)}, "hard");
      return res.status(200).json(new SuccessResponseDto({ message: "Performance detail score deleted successfully" }));
    } catch (error) {
      console.log("Error deleting performance detail score", error);
      return res.status(500).send();
    }
  }
}

Object.entries(performanceDetailScoreController).forEach(([key, value]) => {
  performanceDetailScoreController[key] = catchAsync(value);
});

export default performanceDetailScoreController;

