const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Unauthorized, no secure cookie token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
        req.user = decoded; // Contains id, role, etc.
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized, invalid or expired token" });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Requires admin privileges" });
    }
    next();
};

const isTrainer = (req, res, next) => {
    if (!req.user || req.user.role !== 'trainer') {
        return res.status(403).json({ message: "Requires trainer privileges" });
    }
    next();
};

const isTrainee = (req, res, next) => {
    if (!req.user || req.user.role !== 'trainee') {
        return res.status(403).json({ message: "Requires trainee privileges" });
    }
    next();
};

module.exports = {
    verifyToken,
    isAdmin,
    isTrainer,
    isTrainee
};
