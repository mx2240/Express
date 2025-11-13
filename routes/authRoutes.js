// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUsers
} = require("../controllers/authController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// ✅ Register a new user (student or admin)
router.post("/register", registerUser);

// ✅ Login user
router.post("/login", loginUser);

// ✅ Admin only: get all users
router.get("/users", verifyToken, verifyAdmin, getUsers);

module.exports = router;
