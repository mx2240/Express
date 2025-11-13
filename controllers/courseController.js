// controllers/courseController.js
const Course = require('../models/Course');

// Example usage
async function getAllCourses(req, res) {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getAllCourses };
