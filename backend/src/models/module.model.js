const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    video_url: {
        type: String,
    },
    order_index: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Module = mongoose.model('Module', moduleSchema);
module.exports = Module;
