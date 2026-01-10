import express from "express";
import projectController from "./project.controller.js";

const router = express.Router();

// Basic CRUD routes
router
  .route("/")
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route("/:id")
  .get(projectController.getProject)
  .put(projectController.updateProject)
  .delete(projectController.deleteProject);

// Employee assignment routes
router
  .route("/:projectId/employees")
  .post(projectController.addEmployeeToProject);

router
  .route("/:projectId/employees/:employeeId")
  .delete(projectController.removeEmployeeFromProject);

export default router;
