import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import catchAsync from "../../common/catchAsync.js";
import projectService from "./project.service.js";
import projectValidation from "../../validations/project.validation.js";

const projectController = {
  getAllProjects: catchAsync(async (req, res) => {
    const query = await projectValidation.getProjects.query.validateAsync(
      req.query,
      { abortEarly: false }
    );

    const {
      q,
      name,
      status,
      managerId,
      created_date_from,
      created_date_to,
      updated_date_from,
      updated_date_to,
      start_date_from,
      start_date_to,
      end_date_from,
      end_date_to,
      page,
      limit,
    } = query;

    // Build filter object
    const filter = {};

    // General search (q) - searches both name and description
    if (q) {
      filter.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    // Name search (specific)
    if (name) {
      filter.name = { contains: name, mode: "insensitive" };
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Manager filter
    if (managerId) {
      filter.managerId = parseInt(managerId);
    }

    // Created date range filter
    if (created_date_from || created_date_to) {
      filter.createdAt = {};
      if (created_date_from) {
        filter.createdAt.gte = new Date(created_date_from * 1000);
      }
      if (created_date_to) {
        filter.createdAt.lte = new Date(created_date_to * 1000);
      }
    }

    // Updated date range filter
    if (updated_date_from || updated_date_to) {
      filter.updatedAt = {};
      if (updated_date_from) {
        filter.updatedAt.gte = new Date(updated_date_from * 1000);
      }
      if (updated_date_to) {
        filter.updatedAt.lte = new Date(updated_date_to * 1000);
      }
    }

    // Start date range filter
    if (start_date_from || start_date_to) {
      filter.startDate = {};
      if (start_date_from) {
        filter.startDate.gte = new Date(start_date_from * 1000);
      }
      if (start_date_to) {
        filter.startDate.lte = new Date(start_date_to * 1000);
      }
    }

    // End date range filter
    if (end_date_from || end_date_to) {
      filter.endDate = {};
      if (end_date_from) {
        filter.endDate.gte = new Date(end_date_from * 1000);
      }
      if (end_date_to) {
        filter.endDate.lte = new Date(end_date_to * 1000);
      }
    }

    const projects = await projectService.findManyWithPagination(
      filter,
      parseInt(page) || 1,
      parseInt(limit) || 100
    );

    res.status(200).json(new SuccessResponseDto(projects));
  }),

  getProject: catchAsync(async (req, res) => {
    const params = await projectValidation.getProject.params.validateAsync(
      req.params,
      { abortEarly: false }
    );
    const { id } = params;
    const project = await projectService.findUnique(
      { id: parseInt(id) },
      {
        id: true,
        name: true,
        description: true,
        status: true,
        startDate: true,
        endDate: true,
        budget: true,
        createdAt: true,
        updatedAt: true,
        manager: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        members: {
          select: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            joinedAt: true,
            role: true,
          },
        },
      }
    );

    res.status(200).json(new SuccessResponseDto(project));
  }),

  createProject: catchAsync(async (req, res) => {
    const projectData =
      await projectValidation.createProject.body.validateAsync(req.body, {
        abortEarly: false,
      });
    const newProject = await projectService.create(projectData);
    res.status(201).json(new SuccessResponseDto(newProject));
  }),

  updateProject: catchAsync(async (req, res) => {
    const params = await projectValidation.updateProject.params.validateAsync(
      req.params,
      { abortEarly: false }
    );
    const updateData = await projectValidation.updateProject.body.validateAsync(
      req.body,
      { abortEarly: false }
    );
    const updatedProject = await projectService.update(
      { id: parseInt(params.id) },
      updateData
    );
    res.status(200).json(new SuccessResponseDto(updatedProject));
  }),

  deleteProject: catchAsync(async (req, res) => {
    const params = await projectValidation.deleteProject.params.validateAsync(
      req.params,
      { abortEarly: false }
    );
    await projectService.delete({ id: parseInt(params.id) });
    res
      .status(200)
      .json(new SuccessResponseDto(null, "Project deleted successfully"));
  }),

  addEmployeeToProject: catchAsync(async (req, res) => {
    const params = await projectValidation.addEmployee.params.validateAsync(
      req.params,
      { abortEarly: false }
    );
    const body = await projectValidation.addEmployee.body.validateAsync(
      req.body,
      { abortEarly: false }
    );

    const result = await projectService.addEmployee(
      parseInt(params.projectId),
      parseInt(body.employeeId),
      body.role
    );

    res.status(200).json(new SuccessResponseDto(result));
  }),

  addMultipleEmployeesToProject: catchAsync(async (req, res) => {
    const { projectId } = req.params;
    const { employeeIds } = req.body;

    const result = await projectService.addMultipleEmployeesToProject(
      parseInt(projectId),
      employeeIds
    );

    res.status(200).json(new SuccessResponseDto(result));
  }),

  removeEmployeeFromProject: catchAsync(async (req, res) => {
    const params = await projectValidation.removeEmployee.params.validateAsync(
      req.params,
      { abortEarly: false }
    );

    const result = await projectService.removeEmployee(
      parseInt(params.projectId),
      parseInt(params.employeeId)
    );

    res.status(200).json(new SuccessResponseDto(result));
  }),
};

export default projectController;
