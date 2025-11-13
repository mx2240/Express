const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Middleware: Verify token + admin check
function verifyAdmin(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.userId = decoded.id;

        const user = await User.findById(req.userId);
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }

        next();
    });
}

// ✅ Create a course
router.post("/create", verifyAdmin, async (req, res) => {
    try {
        const { title, code, description, credits, instructor } = req.body;

        const existing = await Course.findOne({ code });
        if (existing) return res.status(400).json({ message: "Course code already exists" });

        const course = await Course.create({ title, code, description, credits, instructor });
        res.status(201).json({ message: "Course created successfully", course });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find();
        res.json({ count: courses.length, courses });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ Update a course
router.put("/:id", verifyAdmin, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json({ message: "Course updated", course });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ Delete a course
router.delete("/:id", verifyAdmin, async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json({ message: "Course deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
