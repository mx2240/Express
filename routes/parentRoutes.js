const express = require("express");
const router = express.Router();

const {
    registerParent,
    loginParent,
    getParentChildren,
    getChildDashboard
} = require("../controllers/parentController");

const { verifyToken, verifyAdmin, verifyParent } = require("../middleware/authMiddleware");

// Register parent (Admin Only)
router.post("/register", verifyToken, verifyAdmin, registerParent);

// Parent login
router.post("/login", loginParent);

// Get children for logged-in parent (no parentId needed)
router.get("/children", verifyToken, verifyParent, getParentChildren);

// Full dashboard for a child (Parent only)
router.get("/child/:studentId", verifyToken, verifyParent, getChildDashboard);

module.exports = router;
