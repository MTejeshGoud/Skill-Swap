const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/user.model');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap');
        
        const adminEmail = 'admin@skillswap.com';
        const adminExists = await User.findOne({ email: adminEmail });
        
        if (adminExists) {
            console.log("Admin already exists! email:", adminExists.email);
            // Optional: reset password just in case they forgot it / messed it up manually in mongo
            const salt = await bcrypt.genSalt(10);
            adminExists.password = await bcrypt.hash('admin123', salt);
            adminExists.role = 'admin'; // ensure role
            await adminExists.save();
            console.log("Admin password forcefully reset to: admin123");
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await User.create({
            name: 'Super Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            fee_paid: true
        });

        console.log(`Admin seeded successfully!`);
        console.log(`Email: ${adminEmail} | Password: admin123`);
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedAdmin();
