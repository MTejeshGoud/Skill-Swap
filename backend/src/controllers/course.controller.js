const Course = require('../models/course.model');
const User = require('../models/user.model');

// Trainer: Create a new course
exports.createCourse = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const trainer_id = req.user.id;

        if (!title || !price || price <= 0) {
            return res.status(400).json({ message: "Valid title and price (>0) are required" });
        }

        const trainer = await User.findById(trainer_id);
        if (!trainer.fee_paid) {
            return res.status(403).json({ message: "Please pay platform fee before creating courses" });
        }

        const newCourse = await Course.create({
            title, description, trainer_id, price
        });

        res.status(201).json({ message: "Course created successfully (draft status by default)", courseId: newCourse._id });
    } catch (err) {
        console.error("Create Course Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Trainer: Submit for approval
exports.submitForApproval = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        
        if (!course || course.trainer_id.toString() !== req.user.id) {
            return res.status(404).json({ message: "Course not found or unauthorized" });
        }

        const trainer = await User.findById(req.user.id);
        if (!trainer.fee_paid) {
            return res.status(403).json({ message: "Please pay platform fee to submit courses" });
        }

        course.status = 'pending';
        await course.save();

        res.status(200).json({ message: "Course submitted for approval" });
    } catch (err) {
        console.error("Submit Course Error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// Admin: Get all courses
exports.getAllCoursesForAdmin = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        console.error("Admin Get Courses Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Admin: Approve or Reject course
exports.updateCourseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Status must be approved or rejected" });
        }

        await Course.findByIdAndUpdate(courseId, { status });
        res.status(200).json({ message: `Course ${status} successfully` });
    } catch (err) {
        console.error("Update Course Status Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Admin: Update course price
exports.updateCoursePrice = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { price } = req.body;

        if (price <= 0) {
            return res.status(400).json({ message: "Price must be greater than 0" });
        }

        await Course.findByIdAndUpdate(courseId, { price });
        res.status(200).json({ message: "Course price updated successfully across the platform" });
    } catch (err) {
        console.error("Update Course Price Error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// Trainee: browse approved courses
exports.getApprovedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ status: 'approved' });
        res.status(200).json(courses);
    } catch (err) {
        console.error("Get Approved Courses Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
