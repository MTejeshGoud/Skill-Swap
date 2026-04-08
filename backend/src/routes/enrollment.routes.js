const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment.controller');
const { verifyToken, isTrainee } = require('../middleware/auth');

// Trainee: get my enrollments
router.get('/', verifyToken, isTrainee, enrollmentController.getMyEnrollments);

// Trainee: get modules of an enrolled course
router.get('/:courseId/content', verifyToken, isTrainee, enrollmentController.getEnrolledCourseContent);

module.exports = router;
