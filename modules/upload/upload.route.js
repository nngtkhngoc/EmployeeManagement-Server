import express from "express";
import uploadController from "./upload.controller.js";
import upload from "../../config/multer.js";
import { BadRequestException } from "../../common/exceptions/exception.js";

const router = express.Router();

const handleMulterError = (err, req, res, next) => {
  if (err) {
    const errorMessage =
      typeof err === "string" ? err : err.message || "File upload failed";
    return next(new BadRequestException(errorMessage));
  }
  next();
};

// Upload single file
router.post(
  "/single",
  upload.single("file"),
  handleMulterError,
  uploadController.uploadSingle
);

// Upload multiple files
router.post(
  "/multiple",
  upload.array("files", 10), // Tối đa 10 files
  handleMulterError,
  uploadController.uploadMultiple
);

export default router;

