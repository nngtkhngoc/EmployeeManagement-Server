import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Exception } from "../../common/exceptions/exception.js";

class NotificationService {
  /**
   * Create and publish a notification to all active employees
   */
  async createNotification(data, createdBy) {
    const { title, content } = data;
    const publishedAt = new Date();

    // Get all active employees
    const activeEmployees = await prisma.employee.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    if (activeEmployees.length === 0) {
      throw new Exception("No active employees found to notify", 400);
    }

    // Create notification and recipients in a transaction
    const notification = await prisma.$transaction(async tx => {
      // Create the notification
      const newNotification = await tx.notification.create({
        data: {
          title,
          content,
          createdBy,
          publishedAt,
        },
      });

      // Create notification recipients for all active employees
      const recipients = activeEmployees.map(emp => ({
        notificationId: newNotification.id,
        employeeId: emp.id,
      }));

      await tx.notificationRecipient.createMany({
        data: recipients,
      });

      return newNotification;
    });

    return {
      ...notification,
      recipientCount: activeEmployees.length,
    };
  }

  /**
   * Get all notifications created by an admin
   */
  async getAdminNotifications(adminId, filters = {}, pagination = {}) {
    const { status = "all" } = filters;
    const { page = 1, limit = 10 } = pagination;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      createdBy: adminId,
      isActive: true,
    };

    if (status === "published") {
      where.publishedAt = { not: null };
    } else if (status === "draft") {
      where.publishedAt = null;
    }

    // Get notifications with recipient counts
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              recipients: true,
            },
          },
          recipients: {
            where: { isRead: true },
            select: { id: true },
          },
        },
      }),
      prisma.notification.count({ where }),
    ]);

    // Format the response
    const formattedNotifications = notifications.map(notif => ({
      id: notif.id,
      title: notif.title,
      content: notif.content,
      publishedAt: notif.publishedAt,
      createdAt: notif.createdAt,
      recipientCount: notif._count.recipients,
      readCount: notif.recipients.length,
    }));

    return {
      notifications: formattedNotifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a specific notification by ID with details
   */
  async getNotificationById(id, userId, isAdmin = false) {
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
          },
        },
        _count: {
          select: {
            recipients: true,
          },
        },
        recipients: {
          where: { isRead: true },
          select: { id: true },
        },
      },
    });

    if (!notification || !notification.isActive) {
      throw new Exception("Notification not found", 404);
    }

    // If admin, check ownership
    if (isAdmin && notification.createdBy !== userId) {
      throw new Exception(
        "You do not have permission to view this notification",
        403
      );
    }

    // If employee, check if they are a recipient
    if (!isAdmin) {
      const recipient = await prisma.notificationRecipient.findUnique({
        where: {
          notificationId_employeeId: {
            notificationId: notification.id,
            employeeId: userId,
          },
        },
      });

      if (!recipient) {
        throw new Exception("You do not have access to this notification", 403);
      }
    }

    return {
      id: notification.id,
      title: notification.title,
      content: notification.content,
      createdBy: notification.createdBy,
      creatorName: notification.creator.fullName,
      publishedAt: notification.publishedAt,
      createdAt: notification.createdAt,
      recipientCount: notification._count.recipients,
      readCount: notification.recipients.length,
      unreadCount:
        notification._count.recipients - notification.recipients.length,
    };
  }

  /**
   * Update a notification (only if not yet published or within 24 hours)
   */
  async updateNotification(id, data, userId) {
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
    });

    if (!notification || !notification.isActive) {
      throw new Exception("Notification not found", 404);
    }

    // Check ownership
    if (notification.createdBy !== userId) {
      throw new Exception(
        "You do not have permission to update this notification",
        403
      );
    }

    // Check if published more than 24 hours ago
    if (notification.publishedAt) {
      const hoursSincePublished =
        (new Date() - new Date(notification.publishedAt)) / (1000 * 60 * 60);
      if (hoursSincePublished > 24) {
        throw new Exception(
          "Cannot update notification after 24 hours of publishing",
          400
        );
      }
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        content: data.content,
      },
    });

    return updatedNotification;
  }

  /**
   * Soft delete a notification
   */
  async deleteNotification(id, userId) {
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
    });

    if (!notification || !notification.isActive) {
      throw new Exception("Notification not found", 404);
    }

    // Check ownership
    if (notification.createdBy !== userId) {
      throw new Exception(
        "You do not have permission to delete this notification",
        403
      );
    }

    await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    return true;
  }

  /**
   * Get all notifications for an employee
   */
  async getEmployeeNotifications(employeeId, filters = {}, pagination = {}) {
    const { isRead } = filters;
    const { page = 1, limit = 10 } = pagination;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      employeeId,
      notification: {
        isActive: true,
        publishedAt: { not: null },
      },
    };

    if (isRead !== undefined) {
      where.isRead = isRead === "true" || isRead === true;
    }

    // Get notifications
    const [recipients, total, unreadCount] = await Promise.all([
      prisma.notificationRecipient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { notification: { publishedAt: "desc" } },
        include: {
          notification: {
            select: {
              id: true,
              title: true,
              content: true,
              publishedAt: true,
            },
          },
        },
      }),
      prisma.notificationRecipient.count({ where }),
      prisma.notificationRecipient.count({
        where: {
          employeeId,
          isRead: false,
          notification: {
            isActive: true,
            publishedAt: { not: null },
          },
        },
      }),
    ]);

    // Format the response
    const notifications = recipients.map(recipient => ({
      id: recipient.notification.id,
      title: recipient.notification.title,
      content: recipient.notification.content,
      publishedAt: recipient.notification.publishedAt,
      isRead: recipient.isRead,
      readAt: recipient.readAt,
    }));

    return {
      notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  /**
   * Get unread notification count for an employee
   */
  async getUnreadCount(employeeId) {
    const count = await prisma.notificationRecipient.count({
      where: {
        employeeId,
        isRead: false,
        notification: {
          isActive: true,
          publishedAt: { not: null },
        },
      },
    });

    return { unreadCount: count };
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId, employeeId) {
    const recipient = await prisma.notificationRecipient.findUnique({
      where: {
        notificationId_employeeId: {
          notificationId: parseInt(notificationId),
          employeeId,
        },
      },
      include: {
        notification: true,
      },
    });

    if (!recipient) {
      throw new Exception("Notification not found", 404);
    }

    if (!recipient.notification.isActive) {
      throw new Exception("Notification is no longer available", 404);
    }

    if (recipient.isRead) {
      return { message: "Notification already marked as read" };
    }

    await prisma.notificationRecipient.update({
      where: {
        notificationId_employeeId: {
          notificationId: parseInt(notificationId),
          employeeId,
        },
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { message: "Notification marked as read" };
  }

  /**
   * Mark all notifications as read for an employee
   */
  async markAllAsRead(employeeId) {
    const result = await prisma.notificationRecipient.updateMany({
      where: {
        employeeId,
        isRead: false,
        notification: {
          isActive: true,
          publishedAt: { not: null },
        },
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { updatedCount: result.count };
  }
}

export default new NotificationService();
