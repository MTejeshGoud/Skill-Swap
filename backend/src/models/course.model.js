const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    level: {
        type: String,
        default: 'Beginner'
    },
    thumbnail: {
        type: String,
    },
    trainer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected'],
        default: 'draft',
    }
}, { timestamps: true });

courseSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
