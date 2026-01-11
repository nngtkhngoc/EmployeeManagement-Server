import express from "express";
import taskController from "./task.controller.js";

const router = express.Router();

// Task routes nested under epics
router
    .route("/epics/:epicId/tasks")
    .get(taskController.getAllTasksByEpic)
    .post(taskController.createTask);

// Task routes by ID
router
    .route("/tasks/:id")
    .get(taskController.getTask)
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

// Set assignments (replace all)
router
    .route("/tasks/:taskId/assignments")
    .put(taskController.setAssignments);

export default router;
