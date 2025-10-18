import express from "express";
import updateRequestController from "../controllers/updateRequest.controller.js";

const router = express.Router();

router
  .route("/")
  .get(updateRequestController.getAllUpdateRequests)
  .post(updateRequestController.createUpdateRequest);

router
  .route("/:id")
  .get(updateRequestController.getUpdateRequest)
  .put(updateRequestController.updateUpdateRequest)
  .delete(updateRequestController.deleteUpdateRequest);

export default router;
