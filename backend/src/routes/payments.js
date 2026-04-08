const express = require('express');
const router = express.Router();
const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const prisma = require('../config/db');
const { auth } = require('../middleware/auth');

router.post('/create-order', auth, async (req, res) => {
    try {
        const { amount, type, courseId } = req.body;
        
        const options = {
            amount: Math.round(amount * 100), // Razorpay amount is in paise
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        // Pre-create pending payment in our DB
        const payment = await prisma.payment.create({
            data: {
                userId: req.user.id,
                amount: parseFloat(amount),
                type,
                status: 'pending'
            }
        });

        res.json({ order, paymentId: payment.id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create Razorpay order' });
    }
});

router.post('/verify', auth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId, courseId } = req.body;
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                        .update(body.toString())
                                        .digest('hex');
                                        
        if (expectedSignature === razorpay_signature) {
            // Payment is valid
            await prisma.payment.update({
                where: { id: paymentId },
                data: { status: 'success' }
            });

            // If it's a course purchase, enroll them
            if (courseId) {
                await prisma.enrollment.create({
                    data: { userId: req.user.id, courseId: courseId }
                });
            }

            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Verification failed' });
    }
});

module.exports = router;
