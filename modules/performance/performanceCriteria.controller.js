import performanceCriteriaService from './performanceCriteria.service.js';
import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";

const performanceCriteria = {
  createPerformanceCriteria: async (req, res) => {
    try {
      const performanceCriteriaData = {
        name: req.body.name,
        description: req.body.description,
      };
      const newPerformanceCriteriaData = await performanceCriteriaService.create(performanceCriteriaData)
      return res.status(200).json(new SuccessResponseDto(newPerformanceCriteriaData));
    } catch (error) {
      console.log("Error creating performance criteria", error);
      return res.status(500).send();
    }
  },
  getAllPerformanceCriteria: async (req, res) => {
    try {
      const performanceCriteriaData = await performanceCriteriaService.read();
      return res.status(200).json(new SuccessResponseDto(performanceCriteriaData));
    } catch (error) {
      console.log("Error getting performance criteria", error);
      return res.status(500).send();
    }
  },
  getPerformanceCriteria: async (req, res) => {
    try {
      const criteriaId = req.params.id;
      const performanceCriteriaData = await performanceCriteriaService.readById(parseInt(criteriaId));
      return res.status(200).json(new SuccessResponseDto(performanceCriteriaData));
    } catch (error) {
      console.log("Error getting performance criteria by ID", error);
      return res.status(500).send();
    }
  },
  deletePerformanceCriteria: async (req, res) => {
    try {
      const criteriaId = req.params.id;
      await performanceCriteriaService.delete({id: parseInt(criteriaId)}, "hard");
      return res.status(200).send(new SuccessResponseDto({ message: "Performance criteria deleted successfully" }));
    } catch (error) {
      console.log("Error deleting performance criteria", error);
      return res.status(500).send();
    }
  },
  updatePerformanceCriteria: async (req, res) => {},
}

export default performanceCriteria;