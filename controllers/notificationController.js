const Notification = require("../models/Notification");

// -------------------- Create Notification --------------------
const createNotification = async (req, res) => {
    try {
        const { title, message, recipient, recipientModel } = req.body;

        if (!title || !message || !recipient || !recipientModel) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const notification = await Notification.create({
            title,
            message,
            recipient,
            recipientModel
        });

        return res.status(201).json({ message: "Notification sent", notification });
    } catch (error) {
        console.error("createNotification error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// -------------------- Get Notifications for User --------------------
const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;

        let modelName;
        if (role === "student") modelName = "Student";
        else if (role === "parent") modelName = "Parent";
        else modelName = "User"; // Admin or other users

        const notifications = await Notification.find({
            recipient: userId,
            recipientModel: modelName
        }).sort({ createdAt: -1 });

        return res.json(notifications);
    } catch (error) {
        console.error("getNotifications error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// -------------------- Mark Notification as Read --------------------
const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;

        const notification = await Notification.findById(notificationId);
        if (!notification) return res.status(404).json({ message: "Notification not found" });

        notification.read = true;
        await notification.save();

        return res.json({ message: "Notification marked as read", notification });
    } catch (error) {
        console.error("markAsRead error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead
};
