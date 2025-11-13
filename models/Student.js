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
const bcrypt = require("bcryptjs");

// Define Student Schema
const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
            minlength: 6,
        },
        role: {
            type: String,
            default: "student",
            enum: ["student", "admin"],
        },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
    },
    { timestamps: true }
);

// 🔐 Hash password before saving
studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 🔑 Compare passwords during login
studentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Student", studentSchema);
