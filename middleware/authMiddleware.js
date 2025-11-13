// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"] || req.headers["Authorization"];
        if (!authHeader) return res.status(401).json({ message: "No token provided" });

        if (!authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "Malformed token" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) return res.status(401).json({ message: "Invalid token" });

        // Attach user from User collection (without password)
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        req.user = user; // will have ._id and .role
        next();
    } catch (err) {
        console.error("verifyToken error:", err.message);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

const verifyAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "No user attached" });
    if (req.user.role && req.user.role === "admin") return next();
    return res.status(403).json({ message: "Access denied. Admin only." });
};

const verifyStudent = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "No user attached" });
    if (req.user.role && req.user.role === "student") return next();
    return res.status(403).json({ message: "Access denied. Students only." });
};

module.exports = { verifyToken, verifyAdmin, verifyStudent };
