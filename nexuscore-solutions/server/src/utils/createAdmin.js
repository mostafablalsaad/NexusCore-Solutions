require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@nexuscore.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      process.exit(0);
    }

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@nexuscore.com',
      password: 'admin123456', // Will be hashed automatically
      role: 'super_admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@nexuscore.com');
    console.log('🔑 Password: admin123456');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
