const express = require("express");
const router = express.Router();
const { enrollStudent, getEnrollments, getStudentEnrollments } = require("../controllers/enrollmentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ==============================
// 📚 Enrollment Routes
// ==============================

// ✅ Enroll a student (Admin only)
router.post("/enroll", protect, adminOnly, enrollStudent);

// ✅ Get all enrollments (Admin only)
router.get("/", protect, adminOnly, getEnrollments);

// ✅ Get specific student’s enrollments (Student dashboard)
router.get("/my-enrollments", protect, getStudentEnrollments);

module.exports = router;
