// controllers/enrollmentController.js
const Student = require("../models/Student");
const Course = require("../models/Course");
const User = require("../models/User");

// Enroll currently authenticated student into :courseId
const enrollStudent = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        if (!courseId) return res.status(400).json({ message: "Missing courseId param" });

        // confirm course exists
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Determine student document:
        // Two common patterns exist in this project: Student docs either have a `user` ref
        // (student.user -> ObjectId(User)) OR Student documents are standalone with _id same as user id.
        // Try both.

        // 1) Try find student by user reference
        let student = await Student.findOne({ user: req.user._id });

        // 2) If not found, try find by _id equals user._id (in case Student = User in some schema)
        if (!student) {
            student = await Student.findById(req.user._id);
        }

        // 3) If still not found, optionally create a Student doc for the user (automate)
        if (!student) {
            // create a lightweight student doc linked to user if model supports `user` field
            try {
                // try to create a doc with user ref
                student = await Student.create({ user: req.user._id, enrolledCourses: [] });
                console.log("Auto-created Student document for user:", req.user.email);


            } catch (createErr) {
                console.error("Failed to auto-create Student doc:", createErr.message);
                return res.status(404).json({ message: "Student profile not found; please contact admin" });
            }
        }

        // Prevent duplicate enrollment
        const already = student.enrolledCourses && student.enrolledCourses.some(id => id.toString() === courseId);
        if (already) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        student.enrolledCourses = student.enrolledCourses || [];
        student.enrolledCourses.push(courseId);
        await student.save();

        // Optionally populate before returning
        const populated = await Student.findById(student._id).populate("enrolledCourses", "title code credits");

        return res.status(200).json({ message: `Enrolled in ${course.title}`, student: populated });
    } catch (err) {
        console.error("enrollStudent error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Admin: get all students with their enrollments
const getEnrollments = async (req, res) => {
    try {
        const students = await Student.find().populate("enrolledCourses", "title code credits").select("user enrolledCourses name email");
        return res.json(students);
    } catch (err) {
        console.error("getEnrollments error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { enrollStudent, getEnrollments };
