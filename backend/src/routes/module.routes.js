const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/module.controller');
const { verifyToken, isTrainer, isTrainee } = require('../middleware/auth');

// Trainer: Add a module
router.post('/:courseId', verifyToken, isTrainer, moduleController.addModule);

// Modules list is typically accessed when enrolled (for Trainee) or when managing course (for Trainer/Admin)
// Accessible by anyone with a valid token? We can keep it simple or restricted.
// Here we just allow authenticated users to fetch modules (though video URLs might be protected elsewhere).
// Actually, enrollment controller handles trainee access. This one is for general fetching if needed.
router.get('/:courseId', verifyToken, moduleController.getModulesForCourse);

module.exports = router;
