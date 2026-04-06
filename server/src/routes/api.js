const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const coursesRoutes = require('./courses');
const uploadRoutes = require('./upload');
const paymentRoutes = require('./payments');
const usersRoutes = require('./users');

router.use('/auth', authRoutes);
router.use('/courses', coursesRoutes);
router.use('/upload', uploadRoutes);
router.use('/payments', paymentRoutes);
router.use('/users', usersRoutes);

router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is securely running' });
});

module.exports = router;
