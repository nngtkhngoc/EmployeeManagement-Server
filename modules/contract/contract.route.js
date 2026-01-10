import express from "express";
import ContractController from "./contract.controller.js";
import upload from "../../config/multer.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { BadRequestException } from "../../common/exceptions/exception.js";

const router = express.Router();

// Middleware để xử lý lỗi từ multer
const handleMulterError = (err, req, res, next) => {
  if (err) {
    // Convert multer/Cloudinary errors thành Error object
    const errorMessage =
      typeof err === "string" ? err : err.message || "File upload failed";
    return next(new BadRequestException(errorMessage));
  }
  next();
};

router.get("/", ContractController.getAllContracts);
router.get("/:id", ContractController.getContractById);
router.post(
  "/",
  verifyToken,
  upload.single("attachment"),
  handleMulterError,
  ContractController.createContract
);
router.put(
  "/:id",
  verifyToken,
  upload.single("attachment"),
  handleMulterError,
  ContractController.updateContract
);
router.delete("/:id", verifyToken, ContractController.deleteContract);
router.patch(
  "/:id/status",
  verifyToken,
  ContractController.updateContractStatus
);
router.get("/employee/:employeeId", ContractController.getContractsByEmployee);
router.get("/signed-by/:managerId", ContractController.getContractsByManager);
router.post("/:id/renew", verifyToken, ContractController.renewContract);
router.get("/stats/overview", ContractController.getContractStats);
router.post(
  "/update-expired",
  verifyToken,
  ContractController.updateExpiredContracts
);

export default router;
