const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    progress: {
        type: Number,
        default: 0.00,
    }
}, { timestamps: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;
