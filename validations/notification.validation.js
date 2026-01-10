import Joi from "joi";

const createNotificationSchema = Joi.object({
  title: Joi.string().min(5).max(255).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.min": "Title must be at least 5 characters",
    "string.max": "Title must not exceed 255 characters",
    "any.required": "Title is required",
  }),
  content: Joi.string().min(10).max(5000).required().messages({
    "string.base": "Content must be a string",
    "string.empty": "Content is required",
    "string.min": "Content must be at least 10 characters",
    "string.max": "Content must not exceed 5000 characters",
    "any.required": "Content is required",
  }),
});

const updateNotificationSchema = Joi.object({
  title: Joi.string().min(5).max(255).optional().messages({
    "string.base": "Title must be a string",
    "string.min": "Title must be at least 5 characters",
    "string.max": "Title must not exceed 255 characters",
  }),
  content: Joi.string().min(10).max(5000).optional().messages({
    "string.base": "Content must be a string",
    "string.min": "Content must be at least 10 characters",
    "string.max": "Content must not exceed 5000 characters",
  }),
}).min(1);

const getNotificationsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional().messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .optional()
    .messages({
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be an integer",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit must not exceed 100",
    }),
  isRead: Joi.boolean().optional().messages({
    "boolean.base": "isRead must be a boolean",
  }),
});

const getAdminNotificationsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional().messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .optional()
    .messages({
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be an integer",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit must not exceed 100",
    }),
  status: Joi.string()
    .valid("published", "draft", "all")
    .default("all")
    .optional()
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of: published, draft, all",
    }),
});

export {
  createNotificationSchema,
  updateNotificationSchema,
  getNotificationsQuerySchema,
  getAdminNotificationsQuerySchema,
};
