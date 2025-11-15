// models/Report.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., "attendance", "grades", "fees"
    title: { type: String, required: true },
    description: { type: String },
    data: { type: mongoose.Schema.Types.Mixed }, // flexible field to store report content
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
