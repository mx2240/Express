const express = require("express");
const router = express.Router();
const {
    createNotification,
    getNotifications,
    markAsRead
} = require("../controllers/notificationController");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Admin can send notification
router.post("/", verifyToken, verifyAdmin, createNotification);

// Users can view their notifications
router.get("/", verifyToken, getNotifications);

// Mark notification as read
router.put("/:notificationId/read", verifyToken, markAsRead);

module.exports = router;
