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
      name,
      status,
      managerId,
      page: tmpPage,
      limit: tmpLimit,
      ...otherFilters
    } = query;
    const page = parseInt(tmpPage) || 1;
    const limit = parseInt(tmpLimit) || 100;

    const filter = {
      ...(name && { name: { contains: name, mode: "insensitive" } }),
      ...(status && { status }),
      ...(managerId && { managerId: parseInt(managerId) }),
      ...otherFilters,
    };

    const projects = await projectService.findManyWithPagination(
      filter,
      page,
      limit,
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
            firstName: true,
            lastName: true,
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
            role: true,
            joinedAt: true,
          },
        },
      }
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
