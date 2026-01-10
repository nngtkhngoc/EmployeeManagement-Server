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

// Executor routes
router
    .route("/epics/:epicId/executors")
    .get(epicController.getExecutors)
    .post(epicController.addExecutor);

router
    .route("/epics/:epicId/executors/:employeeId")
    .delete(epicController.removeExecutor);

export default router;
