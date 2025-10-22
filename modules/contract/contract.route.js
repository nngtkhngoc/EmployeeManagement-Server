import express from "express";

import ContractController from "./contract.controller.js";

const router = express.Router();

router.get("/", ContractController.getAllContracts);
router.get("/:id", ContractController.getContractById);
router.post("/", ContractController.createContract);
router.put("/:id", ContractController.updateContract);
router.delete("/:id", ContractController.deleteContract);
router.patch("/:id/status", ContractController.updateContractStatus);
router.get("/employee/:employeeId", ContractController.getContractsByEmployee);
router.get("/signed-by/:managerId", ContractController.getContractsByManager);
router.post("/:id/renew", ContractController.renewContract);
router.get("/stats/overview", ContractController.getContractStats);

export default router;
