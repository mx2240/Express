const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Grade = require("../models/Grade");
const Fee = require("../models/Fee");

// -------------------- Student Report --------------------
const getStudentReport = async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: "Student not found" });

        const attendance = await Attendance.find({ student: studentId }).sort({ date: -1 });
        const grades = await Grade.find({ student: studentId }).populate("course", "title");
        const fees = await Fee.find({ student: studentId }).sort({ dueDate: -1 });

        return res.json({
            student,
            attendance,
            grades,
            fees
        });
    } catch (error) {
        console.error("getStudentReport error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// -------------------- Course Report --------------------
const getCourseReport = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        const grades = await Grade.find({ course: courseId }).populate("student", "name email");
        const attendance = await Attendance.find({ course: courseId }).populate("student", "name email");

        return res.json({ courseId, grades, attendance });
    } catch (error) {
        console.error("getCourseReport error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// -------------------- Monthly Attendance Report --------------------
const getMonthlyAttendanceReport = async (req, res) => {
    try {
        const { month, year } = req.params; // e.g., month=11, year=2025

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);

        const attendance = await Attendance.find({ date: { $gte: start, $lte: end } })
            .populate("student", "name email")
            .populate("course", "title");

        return res.json({ month, year, attendance });
    } catch (error) {
        console.error("getMonthlyAttendanceReport error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getStudentReport,
    getCourseReport,
    getMonthlyAttendanceReport
};
