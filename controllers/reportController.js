const Report = require("../models/Report");
const Attendance = require("../models/Attendance");
const Grade = require("../models/Grade");
const Fee = require("../models/Fee");
const Notification = require("../models/Notification");

// -------------------- Generate a Report --------------------
const generateReport = async (req, res) => {
    try {
        const { type, recipient, recipientModel, title, description } = req.body;

        if (!type || !title) {
            return res.status(400).json({ message: "Report type and title are required" });
        }

        let reportData = [];

        if (type === "attendance") {
            reportData = await Attendance.find({ student: recipient }).populate("student course");
        } else if (type === "grades") {
            reportData = await Grade.find({ student: recipient }).populate("student course");
        } else if (type === "fees") {
            reportData = await Fee.find({ student: recipient });
        } else if (type === "custom") {
            reportData = [];
        }

        const report = await Report.create({
            title,
            description,
            type,
            recipient,
            recipientModel
        });

        // Optionally send notification
        if (recipient) {
            await Notification.create({
                title: `New Report: ${title}`,
                message: description || `A new ${type} report is available.`,
                recipient,
                recipientModel
            });
        }

        res.status(201).json({ message: "Report generated", report, data: reportData });
    } catch (error) {
        console.error("generateReport error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// -------------------- Get Reports for User --------------------
const getReports = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;

        let modelName;
        if (role === "student") modelName = "Student";
        else if (role === "parent") modelName = "Parent";
        else modelName = "User";

        const reports = await Report.find({
            recipient: userId,
            recipientModel: modelName
        }).sort({ createdAt: -1 });

        res.json(reports);
    } catch (error) {
        console.error("getReports error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { generateReport, getReports };
