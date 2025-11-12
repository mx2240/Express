const express = require("express");
const { getDashboard, updateProfile } = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Protected routes
router.get("/dashboard", protect, getDashboard);
router.put("/profile", protect, updateProfile);

module.exports = router;
