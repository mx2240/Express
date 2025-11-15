const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Parent = require("../models/Parent");

// ========================================
// Verify Token (User/Admin/Student/Parent)
// ========================================
exports.verifyToken = async (req, res, next) => {
    try {
        const header = req.headers['authorization']; // safer lowercase
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = header.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Token missing" });

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Lookup user in User or Parent collection
        let user = await User.findById(decoded.id);
        if (!user) {
            user = await Parent.findById(decoded.id);
        }

        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user; // attach full user object to request
        next();
    } catch (error) {
        console.error("verifyToken error:", error);
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
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
// Verify Parent (can only access their own data)
// ========================================
exports.verifyParent = (req, res, next) => {
    if (!req.user || req.user.role !== "parent") {
        return res.status(403).json({ message: "Access denied. Parents only." });
    }

    // Restrict access to their own data if parentId param is used
    if (req.params.parentId && req.user._id.toString() !== req.params.parentId) {
        return res.status(403).json({ message: "Access denied. You can only view your own children." });
    }

    next();
};
