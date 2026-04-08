const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { verifyToken, isTrainer, isTrainee } = require('../middleware/auth');

// Trainer pays platform fee
router.post('/trainer-fee', verifyToken, isTrainer, paymentController.payTrainerFee);

// Trainee purchases course
router.post('/purchase/:courseId', verifyToken, isTrainee, paymentController.purchaseCourse);

module.exports = router;
