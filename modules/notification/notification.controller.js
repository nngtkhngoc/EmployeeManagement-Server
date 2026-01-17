import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import catchAsync from "../../common/catchAsync.js";
import notificationService from "./notification.service.js";
import {
  createNotificationSchema,
  updateNotificationSchema,
  getNotificationsQuerySchema,
  getAdminNotificationsQuerySchema,
} from "../../validations/notification.validation.js";
import { Exception } from "../../common/exceptions/exception.js";

const notificationController = {
  // Admin endpoints
  createNotification: async (req, res) => {
    // Validate request body
    await createNotificationSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    // Check if user is admin
    // if (req.user.role !== "Admin") {
    //   throw new Exception("Only admins can create notifications", 403);
    // }
    const result = await notificationService.createNotification(
      req.body,
      req.user.id
    );

    return res
      .status(201)
      .json(
        new SuccessResponseDto(
          result,
          "Notification created and published successfully"
        )
      );
  },

  getAdminNotifications: async (req, res) => {
    // Validate query parameters
    const validated = await getAdminNotificationsQuerySchema.validateAsync(
      req.query,
      {
        abortEarly: false,
      }
    );

    // Check if user is admin
    // if (req.user.role !== "Admin") {
    //   throw new Exception("Only admins can access this endpoint", 403);
    // }

    const filters = { status: validated.status };
    const pagination = { page: validated.page, limit: validated.limit };

    const result = await notificationService.getAdminNotifications(
      req.user.id,
      filters,
      pagination
    );

    return res.status(200).json(new SuccessResponseDto(result));
  },

  getNotificationByIdAdmin: async (req, res) => {
    const { id } = req.params;

    // Check if user is admin
    // if (req.user.role !== "Admin") {
    //   throw new Exception("Only admins can access this endpoint", 403);
    // }

    const result = await notificationService.getNotificationById(
      id,
      req.user.id,
      true
    );

    return res.status(200).json(new SuccessResponseDto(result));
  },

  updateNotification: async (req, res) => {
    // Validate request body
    await updateNotificationSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    const { id } = req.params;

    // Check if user is admin
    // if (req.user.role !== "Admin") {
    //   throw new Exception("Only admins can update notifications", 403);
    // }

    const result = await notificationService.updateNotification(
      id,
      req.body,
      req.user.id
    );

    return res
      .status(200)
      .json(
        new SuccessResponseDto(result, "Notification updated successfully")
      );
  },

  deleteNotification: async (req, res) => {
    const { id } = req.params;

    // Check if user is admin
    // if (req.user.role !== "Admin") {
    //   throw new Exception("Only admins can delete notifications", 403);
    // }

    await notificationService.deleteNotification(id, req.user.id);

    return res
      .status(200)
      .json(new SuccessResponseDto(null, "Notification deleted successfully"));
  },

  // Employee endpoints
  getEmployeeNotifications: async (req, res) => {
    // Validate query parameters
    const validated = await getNotificationsQuerySchema.validateAsync(
      req.query,
      {
        abortEarly: false,
      }
    );

    const filters = { isRead: validated.isRead };
    const pagination = { page: validated.page, limit: validated.limit };

    const result = await notificationService.getEmployeeNotifications(
      req.user.id,
      filters,
      pagination
    );

    return res.status(200).json(new SuccessResponseDto(result));
  },

  getUnreadCount: async (req, res) => {
    const result = await notificationService.getUnreadCount(req.user.id);

    return res.status(200).json(new SuccessResponseDto(result));
  },

  markAsRead: async (req, res) => {
    const { id } = req.params;

    const result = await notificationService.markAsRead(id, req.user.id);

    return res.status(200).json(new SuccessResponseDto(null, result.message));
  },

  markAllAsRead: async (req, res) => {
    const result = await notificationService.markAllAsRead(req.user.id);

    return res
      .status(200)
      .json(new SuccessResponseDto(result, "All notifications marked as read"));
  },
};

// Wrap all controller methods with catchAsync
Object.entries(notificationController).forEach(([key, value]) => {
  notificationController[key] = catchAsync(value);
});

export default notificationController;
