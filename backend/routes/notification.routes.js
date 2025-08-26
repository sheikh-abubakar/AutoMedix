import express from "express";
import Notification from "../models/notification.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get notifications for doctor
router.get("/doctor/:doctorId", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.doctorId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Mark all notifications as read (clear)
router.post("/doctor/:doctorId/clear", protect, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.params.doctorId }, { isRead: true });
    res.json({ message: "Notifications cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear notifications" });
  }
});

// Get unread notification count (for bell icon)
router.get("/doctor/:doctorId/count", protect, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.params.doctorId, isRead: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch count" });
  }
});

export default router;