const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { auth, restrictTo } = require('../middleware/auth');

// Get courses logic (Role based)
router.get('/', auth, async (req, res) => {
    try {
        let where = { status: 'approved' };
        if (req.user.role === 'Admin') where = {};
        else if (req.user.role === 'Trainer') where = { trainerId: req.user.id };

        const courses = await prisma.course.findMany({
            where,
            include: { trainer: { select: { name: true } }, videos: true }
        });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
});

// Public exact approved courses
router.get('/public', async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            where: { status: 'approved' },
            include: { trainer: { select: { name: true } }, videos: true }
        });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
});

// Create new course (Trainer only)
router.post('/', auth, restrictTo('Trainer'), async (req, res) => {
    if (!req.user.fee_paid) return res.status(403).json({ error: 'Platform fee must be paid before submitting courses' });
    
    const { title, description, price, status, modules } = req.body;
    try {
        const course = await prisma.course.create({
            data: {
                title, description, price: parseFloat(price), trainerId: req.user.id, status: status || 'pending',
                videos: {
                    create: modules?.map(m => ({ title: m.title, url: m.video })) || []
                }
            }
        });
        res.status(201).json(course);
    } catch(err) {
        res.status(500).json({ error: 'Failed to save course' });
    }
});

// Admin approves courses
router.put('/:id/approve', auth, restrictTo('Admin'), async (req, res) => {
    const { final_price, status } = req.body; // status can be approved or rejected
    try {
        const updated = await prisma.course.update({
            where: { id: req.params.id },
            data: { status: status || 'approved', price: parseFloat(final_price || 0) }
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Approval failed' });
    }
});

module.exports = router;
