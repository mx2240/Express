// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const Student = require("../models/Student");

// // ✅ Middleware to verify token
// function verifyToken(req, res, next) {
//     const authHeader = req.headers["authorization"];
//     if (!authHeader) return res.status(401).json({ message: "No token provided" });

//     const token = authHeader.split(" ")[1];
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) return res.status(403).json({ message: "Invalid token" });
//         req.userId = decoded.id;
//         next();
//     });
// }

// // ✅ GET student dashboard
// router.get("/dashboard", verifyToken, async (req, res) => {
//     try {
//         const student = await Student.findOne({ user: req.userId }).populate("user", "name email");
//         if (!student) {
//             console.log("❌ Student not found for user:", req.userId);
//             return res.status(404).json({ message: "Student not found" });
//         }

//         res.json({
//             message: "Student dashboard data",
//             student,
//         });
//     } catch (err) {
//         console.error("💥 Error in /dashboard:", err);
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// });

// module.exports = router;




const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true,
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course", // ✅ Fix: ensure the Course model exists
            },
        ],
        grades: [
            {
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Course",
                },
                grade: {
                    type: String,
                    enum: ["A", "B", "C", "D", "E", "F", "Incomplete", "Pending"],
                    default: "Pending",
                },
            },
        ],
        feesPaid: {
            type: Boolean,
            default: false,
        },
        balance: {
            type: Number,
            default: 0,
        },
        enrollmentDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);






