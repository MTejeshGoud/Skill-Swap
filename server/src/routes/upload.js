const express = require('express');
const router = express.Router();
const { upload } = require('../config/s3');
const { auth, restrictTo } = require('../middleware/auth');

router.post('/', auth, restrictTo('Trainer'), upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid format' });
    // req.file.location is populated by multer-s3 and holds the public URL
    res.json({ url: req.file.location, originalName: req.file.originalname });
});

module.exports = router;
