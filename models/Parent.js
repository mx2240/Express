const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    relation: { type: String, required: true },
    password: { type: String, required: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    role: { type: String, default: "parent" }
}, {
    timestamps: true
});

module.exports = mongoose.model("Parent", parentSchema);
