const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Verify JWT Token (for all authenticated routes)
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
            return res.status(401).json({ message: "Invalid token or user not found" });
        }

        next();
    } catch (error) {
        console.error("verifyToken error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// ✅ Allow only students
const verifyStudent = (req, res, next) => {
    if (req.user && req.user.role === "student") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Students only." });
    }
};

// ✅ Allow only admins
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
};

module.exports = {
    verifyToken,
    verifyStudent,
    verifyAdmin,
};
