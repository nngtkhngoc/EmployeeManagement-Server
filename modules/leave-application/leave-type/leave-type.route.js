import { Router } from "express";
import leaveTypeController from "./leave-type.controller.js";

const router = Router();

router
  .route("/")
  .get(leaveTypeController.getAll)
  .post(leaveTypeController.create);

router
  .route("/:id")
  .get(leaveTypeController.getById)
  .put(leaveTypeController.update)
  .delete(leaveTypeController.delete);

export default router;
