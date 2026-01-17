import express from "express";
import epicController from "./epic.controller.js";

const router = express.Router();

// Epic routes nested under projects
router
  .route("/projects/:projectId/epics")
  .get(epicController.getAllEpicsByProject)
  .post(epicController.createEpic);

// Epic routes by ID
router
  .route("/epics/:id")
  .get(epicController.getEpic)
  .put(epicController.updateEpic)
  .delete(epicController.deleteEpic);

// Set executors (replace all)
router.route("/epics/:epicId/executors").put(epicController.setExecutors);

export default router;
