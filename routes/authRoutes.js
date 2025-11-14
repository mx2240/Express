const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUsers
} = require("../controllers/authController");

const {
    verifyToken,
    verifyAdmin,
    verifyStudent
} = require("../middleware/authMiddleware");

// ===============================
//  AUTH ROUTES
// ===============================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// ===============================
//  PROTECTED ROUTES
// ===============================

// Get all users (Admin only)
router.get("/users", verifyToken, verifyAdmin, getUsers);

// Example protected student route (optional)
// router.get("/profile", verifyToken, verifyStudent, (req, res) => {
//     res.json({ message: "Student profile", user: req.user });
// });

module.exports = router;
