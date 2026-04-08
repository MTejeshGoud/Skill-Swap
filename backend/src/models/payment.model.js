const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['trainer_fee', 'course_purchase'],
        required: true,
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        required: true,
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
