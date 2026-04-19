const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.put('/:userId/fee', verifyToken, isAdmin, userController.toggleFee);
router.post('/:userId/approve', verifyToken, isAdmin, userController.approveTrainer);

module.exports = router;
