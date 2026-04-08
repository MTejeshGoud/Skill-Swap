const Payment = require('../models/payment.model');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');

// Pay Trainer platform fee
exports.payTrainerFee = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;

        // In a real app, this would integrate with Razorpay or Stripe
        // Assuming payment succeeds:
        await Payment.create({
            user_id: userId,
            amount: amount,
            type: 'trainer_fee',
            status: 'success'
        });

        // Update trainer fee status
        await User.findByIdAndUpdate(userId, { fee_paid: true });

        res.status(200).json({ message: "Platform fee paid successfully" });
    } catch (err) {
        console.error("Pay Trainer Fee Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Trainee purchases a course
exports.purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (course.status !== 'approved') return res.status(400).json({ message: "Course is not available for purchase" });

        const existingEnrollment = await Enrollment.findOne({ user_id: userId, course_id: courseId });
        if (existingEnrollment) return res.status(400).json({ message: "Already enrolled in this course" });

        // Simulate payment success
        await Payment.create({
            user_id: userId,
            amount: course.price,
            type: 'course_purchase',
            status: 'success'
        });

        // Create Enrollment
        await Enrollment.create({ user_id: userId, course_id: courseId });

        res.status(200).json({ message: "Course purchased successfully. You are now enrolled!" });
    } catch (err) {
        console.error("Purchase Course Error:", err);
        res.status(500).json({ message: "Server error" });
    }
}
