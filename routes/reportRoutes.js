const express = require("express");
const router = express.Router();
const {
    getStudentReport,
    getCourseReport,
    getMonthlyAttendanceReport
} = require("../controllers/reportController");

const { verifyToken, verifyAdmin, verifyStudent, verifyParent } = require("../middleware/authMiddleware");

// -------------------- Reports --------------------
// Student report (Admin/Parent/Student)
router.get("/student/:studentId", verifyToken, getStudentReport);

// Course report (Admin only)
router.get("/course/:courseId", verifyToken, verifyAdmin, getCourseReport);

// Monthly attendance report (Admin only)
router.get("/attendance/:month/:year", verifyToken, verifyAdmin, getMonthlyAttendanceReport);

module.exports = router;
