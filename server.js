const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const gradeRoutes = require("./routes/gradeRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/announcements", announcementRoutes);

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");

// ✅ Mount Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("✅ School API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
