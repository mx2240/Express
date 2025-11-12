const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    grades: [
        {
            course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
            score: Number,
            grade: String,
        },
    ],
    feesPaid: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("Student", studentSchema);
