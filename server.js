const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");

dotenv.config();
connectDB();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/student", studentRoutes);

// ✅ Default test route
app.get("/", (req, res) => {
    res.send("✅ School API is running...");
});

// ✅ API routes
app.use("/api/auth", authRoutes);

// ✅ Debug: list all registered routes
console.log("Registered routes:");
setTimeout(() => {
    app._router.stack.forEach((r) => {
        if (r.route && r.route.path) console.log(r.route.path);
    });
}, 500);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
