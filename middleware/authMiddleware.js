const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ========================================
// Verify Token
// ========================================
exports.verifyToken = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = header.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from DB to attach full object
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user; // Now contains _id, role, name, email, etc.
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

// ========================================
// Verify Student
// ========================================
exports.verifyStudent = (req, res, next) => {
    if (!req.user || req.user.role !== "student") {
        return res.status(403).json({ message: "Access denied. Students only." });
    }
    next();
};

// ========================================
// Verify Admin
// ========================================
exports.verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
};
