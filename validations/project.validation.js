import Joi from "joi";

const PROJECT_STATUS = [
  "PLANNING",
  "IN_PROGRESS",
  "COMPLETED",
  "ON_HOLD",
  "CANCELLED",
];

const PROJECT_ROLE = ["MANAGER", "LEAD", "MEMBER", "OBSERVER"];

const employeeItem = Joi.alternatives().try(
  Joi.number().integer(),
  Joi.object({
    employeeId: Joi.number().integer().required(),
    role: Joi.string()
      .valid(...PROJECT_ROLE)
      .default("MEMBER"),
  })
);

const projectValidation = {
  createProject: {
    body: Joi.object({
      name: Joi.string().min(1).max(255).required(),
      description: Joi.string().max(1000).optional(),
      status: Joi.string()
        .valid(...PROJECT_STATUS)
        .default("PLANNING"),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional().greater(Joi.ref("startDate")),
      budget: Joi.number().min(0).optional(),
      managerId: Joi.number().integer().optional(),
      employeeIds: Joi.array().items(employeeItem).min(1).optional(),
      githubRepoUrl: Joi.string().uri().max(500).optional(),
      githubAppId: Joi.string().max(50).optional(),
      githubAppInstallationId: Joi.string().max(50).optional(),
    }).unknown(false),
  },

  updateProject: {
    params: Joi.object({
      id: Joi.number().integer().required(),
    }).unknown(false),

    body: Joi.object({
      name: Joi.string().min(1).max(255).optional(),
      description: Joi.string().max(1000).optional(),
      status: Joi.string()
        .valid(...PROJECT_STATUS)
        .optional(),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional().greater(Joi.ref("startDate")),
      budget: Joi.number().min(0).optional(),
      managerId: Joi.number().integer().allow(null).optional(),
      employeeIds: Joi.array().items(employeeItem).optional(),
      githubRepoUrl: Joi.string().uri().max(500).optional(),
      githubAppId: Joi.string().max(50).optional(),
      githubAppInstallationId: Joi.string().max(50).optional(),
    })
      .min(1) // ❗ must update at least one field
      .unknown(false),
  },

  getProject: {
    params: Joi.object({
      id: Joi.number().integer().required(),
    }).unknown(false),
  },

  deleteProject: {
    params: Joi.object({
      id: Joi.number().integer().required(),
    }).unknown(false),
  },

  addEmployee: {
    params: Joi.object({
      projectId: Joi.number().integer().required(),
    }).unknown(false),

    body: Joi.object({
      employeeId: Joi.number().integer().required(),
      role: Joi.string()
        .valid(...PROJECT_ROLE)
        .default("MEMBER"),
    }).unknown(false),
  },

  removeEmployee: {
    params: Joi.object({
      projectId: Joi.number().integer().required(),
      employeeId: Joi.number().integer().required(),
    }).unknown(false),
  },

  getProjects: {
    query: Joi.object({
      q: Joi.string().optional(),
      name: Joi.string().optional(),
      status: Joi.string()
        .valid(...PROJECT_STATUS)
        .optional(),
      managerId: Joi.number().integer().optional(),
      created_date_from: Joi.number().integer().optional(),
      created_date_to: Joi.number().integer().optional(),
      updated_date_from: Joi.number().integer().optional(),
      updated_date_to: Joi.number().integer().optional(),
      start_date_from: Joi.number().integer().optional(),
      start_date_to: Joi.number().integer().optional(),
      end_date_from: Joi.number().integer().optional(),
      end_date_to: Joi.number().integer().optional(),
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(100).optional(),
    }).unknown(false),
  },
};

export default projectValidation;
