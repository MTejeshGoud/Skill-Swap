const User = require('../models/user.model');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        // Map to expected frontend format (id instead of _id)
        const mappedUsers = users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            // Format roles to Title case as Frontend expects it (e.g. "Trainer")
            role: u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : 'Unknown',
            fee_paid: u.fee_paid,
            isApproved: u.fee_paid || u.role === 'admin'
        }));
        res.status(200).json(mappedUsers);
    } catch (err) {
        console.error("Get All Users Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.toggleFee = async (req, res) => {
    try {
        const { userId } = req.params;
        const { feePaidStatus } = req.body;
        await User.findByIdAndUpdate(userId, { fee_paid: feePaidStatus });
        res.status(200).json({ message: "Fee status updated" });
    } catch (err) {
        console.error("Toggle Fee Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.approveTrainer = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndUpdate(userId, { fee_paid: true });
        res.status(200).json({ message: "Trainer approved" });
    } catch (err) {
        console.error("Approve Trainer Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
