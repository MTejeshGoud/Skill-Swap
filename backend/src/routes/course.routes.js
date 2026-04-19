const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { verifyToken, isTrainer, isAdmin, isTrainee } = require('../middleware/auth');

// Trainee routes
router.get('/approved', verifyToken, isTrainee, courseController.getApprovedCourses);

// Trainer routes
router.get('/trainer', verifyToken, isTrainer, courseController.getTrainerCourses);
router.post('/', verifyToken, isTrainer, courseController.createCourse);
router.put('/:courseId', verifyToken, isTrainer, courseController.updateCourse);
router.post('/:courseId/submit', verifyToken, isTrainer, courseController.submitForApproval);

// Admin routes
router.get('/all', verifyToken, isAdmin, courseController.getAllCoursesForAdmin);
router.put('/:courseId/status', verifyToken, isAdmin, courseController.updateCourseStatus);
router.put('/:courseId/price', verifyToken, isAdmin, courseController.updateCoursePrice);

module.exports = router;
