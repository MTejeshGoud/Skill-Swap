const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateTokenAndSetCookie = (res, user) => {
    const token = jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET || 'supersecret',
        { expiresIn: '1d' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return token;
};

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!['admin', 'trainer', 'trainee'].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ name, email, password: hashedPassword, role });
        
        generateTokenAndSetCookie(res, newUser);

        res.status(201).json({ 
            message: "User registered securely", 
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, fee_paid: newUser.fee_paid }
        });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user);

        res.status(200).json({
            message: "Login secure",
            user: { id: user._id, name: user.name, email: user.email, role: user.role, fee_paid: user.fee_paid }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Logout user
exports.logout = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Logged out successfully" });
};

// Verify active session based on cookie
exports.getMe = async (req, res) => {
    try {
        // req.user is set by verifyToken middleware if the cookie was valid
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, fee_paid: user.fee_paid } });
    } catch (err) {
        console.error("Get Me Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
