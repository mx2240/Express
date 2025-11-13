const Student = require("../models/Student");
const Course = require("../models/Course");

// ✅ Enroll a student in a course (Admin)
const enrollStudent = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        const student = await Student.findById(studentId);
        const course = await Course.findById(courseId);

        if (!student || !course) {
            return res.status(404).json({ message: "Student or Course not found" });
        }

        // Prevent duplicate enrollment
        if (student.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: "Student already enrolled in this course" });
        }

        student.enrolledCourses.push(courseId);
        await student.save();

        res.status(200).json({
            message: `✅ ${student.name} successfully enrolled in ${course.title}`,
            student,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get all enrollments (Admin)
const getEnrollments = async (req, res) => {
    try {
        const students = await Student.find()
            .populate("enrolledCourses", "title code credits")
            .select("name email enrolledCourses");

        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get logged-in student’s enrollments
const getStudentEnrollments = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).populate("enrolledCourses", "title code credits");
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student.enrolledCourses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { enrollStudent, getEnrollments, getStudentEnrollments };
