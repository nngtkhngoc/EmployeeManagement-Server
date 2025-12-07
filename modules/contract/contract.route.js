import express from "express";
import ContractController from "./contract.controller.js";
import upload from "../../config/multer.js";

const router = express.Router();

router.get("/", ContractController.getAllContracts);
router.get("/:id", ContractController.getContractById);
router.post("/", upload.single("attachment"), ContractController.createContract);
router.put("/:id", upload.single("attachment"), ContractController.updateContract);
router.delete("/:id", ContractController.deleteContract);
router.patch("/:id/status", ContractController.updateContractStatus);
router.get("/employee/:employeeId", ContractController.getContractsByEmployee);
router.get("/signed-by/:managerId", ContractController.getContractsByManager);
router.post("/:id/renew", ContractController.renewContract);
router.get("/stats/overview", ContractController.getContractStats);
router.post("/update-expired", ContractController.updateExpiredContracts);

export default router;
