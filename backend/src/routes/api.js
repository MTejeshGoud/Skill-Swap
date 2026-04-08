const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const courseRoutes = require('./course.routes');
const moduleRoutes = require('./module.routes');
const paymentRoutes = require('./payment.routes');
const enrollmentRoutes = require('./enrollment.routes');

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/modules', moduleRoutes);
router.use('/payments', paymentRoutes);
router.use('/enrollments', enrollmentRoutes);

// MongoDB collections are initialized automatically by Mongoose upon insert

module.exports = router;
