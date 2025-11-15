const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, required: true }, // student or parent
    recipientModel: { type: String, enum: ["Student", "Parent"], required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
