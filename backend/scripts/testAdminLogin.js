import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: '../../.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const adminEmail = 'jhansi.vandana1@gmail.com';
const adminPassword = 'Janu@123';

async function testAdminLogin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: adminEmail });
    if (!user) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user found:', {
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      hasPassword: !!user.password
    });

    // Test password comparison
    const isMatch = await bcrypt.compare(adminPassword, user.password);
    console.log('Password match result:', isMatch);

    if (isMatch) {
      console.log('✅ Password verification successful');
    } else {
      console.log('❌ Password verification failed');
      
      // Let's update the password to make sure it's correct
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });
      console.log('🔄 Password updated with correct hash');
      
      // Test again
      const updatedUser = await User.findById(user._id);
      const newMatch = await bcrypt.compare(adminPassword, updatedUser.password);
      console.log('New password match result:', newMatch);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error testing admin login:', error);
    process.exit(1);
  }
}

testAdminLogin();
