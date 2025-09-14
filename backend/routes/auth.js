import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Order from '../models/Order.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';
import inMemoryStorage from '../utils/inMemoryStorage.js';

const router = express.Router();

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('Registration attempt:', { name, email });
  
  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }
  
  try {
    let user;
    
    // Check if MongoDB is available
    if (mongoose.connection.readyState === 1) {
      console.log('Using MongoDB for user storage');
      
      // Check if user already exists
      user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Create new user with MongoDB
      user = new User({ name, email, password });
      await user.save();
      
      console.log('User created successfully in MongoDB:', user._id);
    } else {
      console.log('MongoDB not available, using in-memory storage');
      
      // Use in-memory storage as fallback
      try {
        user = await inMemoryStorage.create({ name, email, password });
        console.log('User created successfully in memory:', user._id);
      } catch (error) {
        if (error.message === 'User already exists') {
          return res.status(400).json({ message: 'User already exists' });
        }
        throw error;
      }
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin || false },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'MongooseServerSelectionError' || error.name === 'MongoNetworkError') {
      return res.status(503).json({ 
        message: 'Database connection error. Please try again later.' 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Real login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email });
  
  try {
    let user;
    let isMatch = false;
    
    // Check if MongoDB is available
    if (mongoose.connection.readyState === 1) {
      console.log('Using MongoDB for login');
      user = await User.findOne({ email });
      if (user) {
        isMatch = await bcrypt.compare(password, user.password);
      }
    } else {
      console.log('MongoDB not available, using in-memory storage for login');
      user = await inMemoryStorage.findByEmail(email);
      if (user) {
        isMatch = await inMemoryStorage.comparePassword(user._id, password);
      }
    }
    
    if (!user || !isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin || false },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user's orders
    const orders = await Order.find({ user: userId });
    
    // Calculate statistics
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Get user's join date
    const user = await User.findById(userId).select('createdAt');
    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    }) : 'Unknown';
    
    res.json({
      totalOrders,
      totalSpent,
      memberSince,
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const userId = req.user.userId;

    // Input validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered to another account' });
    }

    // Prepare update data
    const updateData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
    };

    // Handle address fields
    if (address) {
      updateData.address = {
        street: address.street?.trim() || '',
        city: address.city?.trim() || '',
        state: address.state?.trim() || '',
        pincode: address.pincode?.trim() || '',
        country: address.country?.trim() || 'India'
      };
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});

export default router;