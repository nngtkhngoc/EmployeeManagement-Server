import performanceService from "./performance.service.js";
import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";

const performanceController = {
  createReport: async (req, res) => {
    try {
      const performanceData = {
        month: req.body.month,
        year: req.body.year,
      };
      const newReportData = await performanceService.create(performanceData)
      return res.status(200).json(new SuccessResponseDto(newReportData));
    } catch (error) {
      console.log("Error creating performance report", error);
      return res.status(500).send();
    }
  },
  getAllReport: async (req, res) => {
    try {
      const performanceData = await performanceService.read();
      return res.status(200).json(new SuccessResponseDto(performanceData));
    } catch (error) {
      console.log("Error getting performance reports", error);
      return res.status(500).send();
    }
  },
  getReport: async (req, res) => {
    console.log(req.params.id)
    try {
      const reportId = req.params.id;
      const performanceData = await performanceService.readById(parseInt(reportId));
      return res.status(200).json(new SuccessResponseDto(performanceData));
    } catch (error) {
      console.log("Error getting performance report by ID", error);
      return res.status(500).send();
    }
  },
  deleteReport: async (req, res) => {
    try {
      const reportId = req.params.id;
      await performanceService.delete({id: parseInt(reportId)}, "hard");
      return res.status(200).json(new SuccessResponseDto({ message: "Performance report deleted successfully" }));
    } catch (error) {
      console.log("Error deleting performance report", error);
      return res.status(500).send();
    }
  },
  updateReport: async (req, res) => {},
}

export default performanceController;