const Enrollment = require('../models/enrollment.model');
const Module = require('../models/module.model');

// Trainee: Get enrolled courses
exports.getMyEnrollments = async (req, res) => {
    try {
        const userId = req.user.id;
        // Populate the course details tied to the enrollment
        const enrollments = await Enrollment.find({ user_id: userId }).populate('course_id', 'title description status');
        res.status(200).json(enrollments);
    } catch (err) {
        console.error("Get Enrollments Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Trainee: Access enrolled course content (modules)
exports.getEnrolledCourseContent = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const enrollment = await Enrollment.findOne({ user_id: userId, course_id: courseId });
        if (!enrollment) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }

        const modules = await Module.find({ course_id: courseId }).sort({ order_index: 1 });
        res.status(200).json(modules);
    } catch (err) {
        console.error("Get Enrolled Content Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
