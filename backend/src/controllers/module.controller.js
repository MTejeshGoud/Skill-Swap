const Module = require('../models/module.model');
const Course = require('../models/course.model');

// Trainer: Add a module to a course
exports.addModule = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, video_url, order_index } = req.body;
        
        // Ensure user is the trainer of the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (course.trainer_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to add module to this course" });
        }

        const newModule = await Module.create({
            course_id: courseId,
            title,
            description,
            video_url,
            order_index
        });

        res.status(201).json({ message: "Module added successfully", moduleId: newModule._id });
    } catch (err) {
        console.error("Add Module Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Fetch modules for a specific course
exports.getModulesForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const modules = await Module.find({ course_id: courseId }).sort({ order_index: 1 });
        res.status(200).json(modules);
    } catch (err) {
        console.error("Get Modules Error:", err);
        res.status(500).json({ message: "Server error" });
    }
}
