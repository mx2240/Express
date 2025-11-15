const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin, verifyParent, verifyStudent } = require("../middleware/authMiddleware");
const { createReport, sendNotification, getNotifications, markNotificationRead } = require("../controllers/notificationController");

// Admin routes
router.post("/report", verifyToken, verifyAdmin, createReport);
router.post("/send", verifyToken, verifyAdmin, sendNotification);

// User routes (Student / Parent)
router.get("/", verifyToken, getNotifications);
router.patch("/:id/read", verifyToken, markNotificationRead);

module.exports = router;
