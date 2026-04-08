const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { auth, restrictTo } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', auth, restrictTo('Admin'), async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, fee_paid: true, createdAt: true }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Update Trainer fee status
router.put('/:id/fee', auth, restrictTo('Admin'), async (req, res) => {
    const { fee_paid } = req.body;
    try {
        const updated = await prisma.user.update({
            where: { id: req.params.id },
            data: { fee_paid }
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update fee status' });
    }
});

// Note: Trainer "role" string approval is basically setting fee_paid or a separate isApproved flag.
// In our prisma schema, we didn't have an isApproved flag, so we rely on fee_paid for workflow logic.

module.exports = router;
