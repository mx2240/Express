const Student = require("../models/Student");
const User = require("../models/User");

// @desc Get student dashboard
// @route GET /api/student/dashboard
// @access Private
const getDashboard = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id })
            .populate("user", "name email role")
            .populate("courses", "title code credits");

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({
            message: "Student dashboard data",
            student,

        });

        console.log("Looking for student with user ID:", req.user._id);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });

    }
};


// @desc Update student profile
// @route PUT /api/student/profile
// @access Private
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getDashboard, updateProfile };
