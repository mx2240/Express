const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/enrollments", enrollmentRoutes);


// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

// ✅ Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.get("/", (req, res) => {
    res.send("✅ School API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
