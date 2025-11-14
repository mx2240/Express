const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===========================
//  REGISTER USER
// ===========================
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if email exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "student"
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("registerUser error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ===========================
//  LOGIN USER
// ===========================
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("🔍 Login request body:", req.body);

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // Find user in DB
        const user = await User.findOne({ email });

        console.log("🔍 Found user:", user);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        console.log("🔍 Password match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error("loginUser error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ===========================
//  ADMIN: GET ALL USERS
// ===========================
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            message: "Users fetched successfully",
            users
        });

    } catch (error) {
        console.error("getUsers error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
