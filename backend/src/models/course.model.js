const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    trainer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected'],
        default: 'draft',
    }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
