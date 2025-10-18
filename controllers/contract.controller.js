import { contractService } from "../services/contract.service.js";

const contractController = {
  getAllContracts: async (req, res) => {
    try {
      const contracts = await contractService.getAllContracts();

      return res.status(200).json({ data: contracts });
    } catch (error) {
      return res.status(500).send();
    }
  },
  getContract: async (req, res) => {},
  createContract: async (req, res) => {
    try {
    } catch (error) {}
  },
  deleteContract: async (req, res) => {},
  updateContract: async (req, res) => {},
};

export default contractController;
