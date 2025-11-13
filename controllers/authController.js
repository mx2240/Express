// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student"); // ✅ new
const dotenv = require("dotenv");
dotenv.config();

// 🟢 Register new user (student or admin)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "student",
        });

        // 🧠 Automatically create Student profile if role = student
        if (user.role === "student") {
            await Student.create({
                user: user._id,
                name: user.name,
                email: user.email,
                enrolledCourses: [],
            });
            console.log(`✅ Created Student profile for ${user.email}`);
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error("registerUser error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 🟣 Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error("loginUser error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 🟡 Get all users (admin only, optional)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { registerUser, loginUser, getUsers };
