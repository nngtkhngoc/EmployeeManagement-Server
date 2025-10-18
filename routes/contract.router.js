import express from "express";
import contractController from "../controllers/contract.controller.js";

const router = express.Router();

router
  .route("/")
  .get(contractController.getAllContracts)
  .post(contractController.createContract);

router
  .route("/:id")
  .get(contractController.getContract)
  .put(contractController.updateContract)
  .delete(contractController.deleteContract);

export default router;
