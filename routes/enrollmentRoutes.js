const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Course = require("../models/Course");
const { verifyToken, verifyStudent } = require("../middleware/authMiddleware");

// ✅ Enroll in a course
router.post("/enroll/:courseId", verifyToken, verifyStudent, async (req, res) => {
    try {
        const { courseId } = req.params;
        const student = await Student.findById(req.userId);

        if (!student) return res.status(404).json({ message: "Student not found" });

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Prevent duplicate enrollment
        if (student.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        student.enrolledCourses.push(courseId);
        await student.save();

        res.status(200).json({
            message: `Successfully enrolled in ${course.title}`,
            enrolledCourses: student.enrolledCourses,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ Drop a course
router.post("/drop/:courseId", verifyToken, verifyStudent, async (req, res) => {
    try {
        const { courseId } = req.params;
        const student = await Student.findById(req.userId);

        if (!student) return res.status(404).json({ message: "Student not found" });

        student.enrolledCourses = student.enrolledCourses.filter(
            (id) => id.toString() !== courseId
        );
        await student.save();

        res.status(200).json({
            message: "Course dropped successfully",
            enrolledCourses: student.enrolledCourses,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ View all enrolled courses
router.get("/my-courses", verifyToken, verifyStudent, async (req, res) => {
    try {
        const student = await Student.findById(req.userId).populate("enrolledCourses");

        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({
            message: "Your enrolled courses",
            enrolledCourses: student.enrolledCourses,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
