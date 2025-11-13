// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        name: String,
        email: String,
        enrolledCourses: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        ],
        grades: [
            {
                course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
                score: Number,
                grade: String,
            },
        ],
        feesPaid: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
