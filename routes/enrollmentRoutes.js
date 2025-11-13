// routes/enrollmentRoutes.js
const express = require("express");
const router = express.Router();
const { enrollStudent, getEnrollments } = require("../controllers/enrollmentController");
const { verifyToken, verifyStudent, verifyAdmin } = require("../middleware/authMiddleware");

console.log("✅ enrollStudent:", typeof enrollStudent);
console.log("✅ getEnrollments:", typeof getEnrollments);


// ✅ Student enrolls in a course
router.post("/enroll/:courseId", verifyToken, verifyStudent, enrollStudent);

// ✅ Admin gets all enrollments
router.get("/", verifyToken, verifyAdmin, getEnrollments);





module.exports = router;
