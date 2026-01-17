import express from "express";
import notificationController from "./notification.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
const router = express.Router();

// Employee endpoints (must be authenticated)
router.get("/unread-count", verifyToken, notificationController.getUnreadCount);
router.put("/mark-all-read", verifyToken, notificationController.markAllAsRead);
router.get("/", verifyToken, notificationController.getEmployeeNotifications);
router.put("/:id/read", verifyToken, notificationController.markAsRead);

// Admin endpoints (must be authenticated and have admin role)
router.post("/", verifyToken, notificationController.createNotification);
router.get("/admin", verifyToken, notificationController.getAdminNotifications);
router.get(
  "/admin/:id",
  verifyToken,
  notificationController.getNotificationByIdAdmin
);
router.put("/:id", verifyToken, notificationController.updateNotification);
router.delete("/:id", verifyToken, notificationController.deleteNotification);

export default router;
