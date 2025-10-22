import performanceDetailScoreService from "./performanceDetailScore.service.js";
import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";

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
  updatePerformanceDetailScores: async (req, res) => {},
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

export default performanceDetailScoreController;

