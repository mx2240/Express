const express = require("express");
const router = express.Router();
const { registerParent, loginParent, getParentChildren, getChildDashboard } = require("../controllers/parentController");
const { verifyToken, verifyParent, verifyAdmin } = require("../middleware/authMiddleware");

// Admin only: register parent
router.post("/register", verifyToken, verifyAdmin, registerParent);

// Parent login (no token needed)
router.post("/login", loginParent);

// Parent-only: get their children
router.get("/:parentId/children", verifyToken, verifyParent, getParentChildren);

// Parent-only: view child's dashboard
router.get("/child/:studentId", verifyToken, verifyParent, getChildDashboard);

module.exports = router;
