import express from 'express';
import Coupon from '../models/Coupon.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all coupons (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Search by code or description
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status === 'active') {
      const now = new Date();
      query.isActive = true;
      query.validFrom = { $lte: now };
      query.validUntil = { $gte: now };
    } else if (status === 'expired') {
      query.validUntil = { $lt: new Date() };
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const coupons = await Coupon.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Coupon.countDocuments(query);

    res.json({
      coupons,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

// Get single coupon (Admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('usedBy.user', 'name email');

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json(coupon);
  } catch (error) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({ error: 'Failed to fetch coupon' });
  }
});

// Create new coupon (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      usageLimit,
      userUsageLimit,
      validFrom,
      validUntil,
      applicableCategories,
      excludedCategories
    } = req.body;

    // Validation
    if (!code || !description || !discountType || !discountValue || !validUntil) {
      return res.status(400).json({ 
        error: 'Code, description, discount type, discount value, and valid until date are required' 
      });
    }

    if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
      return res.status(400).json({ 
        error: 'Percentage discount must be between 1 and 100' 
      });
    }

    if (discountType === 'fixed' && discountValue <= 0) {
      return res.status(400).json({ 
        error: 'Fixed discount must be greater than 0' 
      });
    }

    const validUntilDate = new Date(validUntil);
    if (validUntilDate <= new Date()) {
      return res.status(400).json({ 
        error: 'Valid until date must be in the future' 
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minimumOrderAmount: minimumOrderAmount || 0,
      maximumDiscountAmount: maximumDiscountAmount || null,
      usageLimit: usageLimit || null,
      userUsageLimit: userUsageLimit || 1,
      validFrom: validFrom ? new Date(validFrom) : new Date(),
      validUntil: validUntilDate,
      applicableCategories: applicableCategories || [],
      excludedCategories: excludedCategories || [],
      createdBy: req.user.userId
    });

    await coupon.save();
    await coupon.populate('createdBy', 'name email');

    res.status(201).json(coupon);
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

// Update coupon (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    const {
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      usageLimit,
      userUsageLimit,
      validFrom,
      validUntil,
      isActive,
      applicableCategories,
      excludedCategories
    } = req.body;

    // Validation
    if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
      return res.status(400).json({ 
        error: 'Percentage discount must be between 1 and 100' 
      });
    }

    if (discountType === 'fixed' && discountValue <= 0) {
      return res.status(400).json({ 
        error: 'Fixed discount must be greater than 0' 
      });
    }

    // Update fields
    if (description !== undefined) coupon.description = description;
    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (minimumOrderAmount !== undefined) coupon.minimumOrderAmount = minimumOrderAmount;
    if (maximumDiscountAmount !== undefined) coupon.maximumDiscountAmount = maximumDiscountAmount;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (userUsageLimit !== undefined) coupon.userUsageLimit = userUsageLimit;
    if (validFrom !== undefined) coupon.validFrom = new Date(validFrom);
    if (validUntil !== undefined) coupon.validUntil = new Date(validUntil);
    if (isActive !== undefined) coupon.isActive = isActive;
    if (applicableCategories !== undefined) coupon.applicableCategories = applicableCategories;
    if (excludedCategories !== undefined) coupon.excludedCategories = excludedCategories;

    await coupon.save();
    await coupon.populate('createdBy', 'name email');

    res.json(coupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});

// Delete coupon (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    // Check if coupon has been used
    if (coupon.usedCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete coupon that has been used. You can deactivate it instead.' 
      });
    }

    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

// Validate coupon (Public - for checkout)
router.post('/validate', async (req, res) => {
  try {
    const { code, orderAmount, userId, cartItems } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({ error: 'Coupon code and order amount are required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    // Check if coupon is currently valid
    if (!coupon.isCurrentlyValid) {
      return res.status(400).json({ error: 'Coupon is not valid or has expired' });
    }

    // Check user usage limit if user is provided
    if (userId && !coupon.canUserUseCoupon(userId)) {
      return res.status(400).json({ error: 'You have already used this coupon the maximum number of times' });
    }

    // Check minimum order amount
    if (orderAmount < coupon.minimumOrderAmount) {
      return res.status(400).json({ 
        error: `Minimum order amount of ₹${coupon.minimumOrderAmount} required for this coupon` 
      });
    }

    // Check category restrictions if cart items are provided
    if (cartItems && cartItems.length > 0) {
      const cartCategories = [...new Set(cartItems.map(item => item.category))];
      
      // Check if any categories are excluded
      if (coupon.excludedCategories.length > 0) {
        const hasExcludedCategory = cartCategories.some(category => 
          coupon.excludedCategories.includes(category)
        );
        if (hasExcludedCategory) {
          return res.status(400).json({ 
            error: 'This coupon cannot be applied to items in your cart' 
          });
        }
      }
      
      // Check if cart has applicable categories (if specified)
      if (coupon.applicableCategories.length > 0) {
        const hasApplicableCategory = cartCategories.some(category => 
          coupon.applicableCategories.includes(category)
        );
        if (!hasApplicableCategory) {
          return res.status(400).json({ 
            error: 'This coupon is not applicable to items in your cart' 
          });
        }
      }
    }

    // Calculate discount
    const discountAmount = coupon.calculateDiscount(orderAmount);

    res.json({
      valid: true,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      },
      discountAmount,
      finalAmount: orderAmount - discountAmount
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
});

// Apply coupon (called during order creation)
router.post('/apply', async (req, res) => {
  try {
    const { couponId, userId, orderAmount } = req.body;

    if (!couponId || !orderAmount) {
      return res.status(400).json({ error: 'Coupon ID and order amount are required' });
    }

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    // Validate coupon again
    if (!coupon.isCurrentlyValid) {
      return res.status(400).json({ error: 'Coupon is no longer valid' });
    }

    if (userId && !coupon.canUserUseCoupon(userId)) {
      return res.status(400).json({ error: 'Coupon usage limit exceeded' });
    }

    const discountAmount = coupon.calculateDiscount(orderAmount);
    
    // Use the coupon
    await coupon.useCoupon(userId, orderAmount, discountAmount);

    res.json({
      success: true,
      discountAmount,
      finalAmount: orderAmount - discountAmount
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    res.status(500).json({ error: 'Failed to apply coupon' });
  }
});

// Seed test coupons (Public - for testing)
router.post('/seed-test', async (req, res) => {
  try {
    const User = mongoose.model('User');
    
    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    // Clear existing coupons
    await Coupon.deleteMany({});
    console.log('Cleared existing coupons');

    // Current date and future dates
    const now = new Date();
    const validFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
    const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    // Sample coupons
    const coupons = [
      {
        code: 'WELCOME10',
        description: 'Get 10% off on your first order',
        discountType: 'percentage',
        discountValue: 10,
        minimumOrderAmount: 500,
        maximumDiscountAmount: 200,
        usageLimit: 100,
        userUsageLimit: 1,
        validFrom,
        validUntil,
        isActive: true,
        applicableCategories: [],
        excludedCategories: [],
        createdBy: adminUser._id
      },
      {
        code: 'SAVE20',
        description: 'Save 20% on orders above ₹1000',
        discountType: 'percentage',
        discountValue: 20,
        minimumOrderAmount: 1000,
        maximumDiscountAmount: 500,
        usageLimit: 50,
        userUsageLimit: 2,
        validFrom,
        validUntil,
        isActive: true,
        applicableCategories: [],
        excludedCategories: [],
        createdBy: adminUser._id
      },
      {
        code: 'FLAT100',
        description: 'Flat ₹100 off on minimum order of ₹300',
        discountType: 'fixed',
        discountValue: 100,
        minimumOrderAmount: 300,
        usageLimit: 200,
        userUsageLimit: 3,
        validFrom,
        validUntil,
        isActive: true,
        applicableCategories: [],
        excludedCategories: [],
        createdBy: adminUser._id
      },
      {
        code: 'FESTIVE50',
        description: 'Festive offer - 50% off on selected categories',
        discountType: 'percentage',
        discountValue: 50,
        minimumOrderAmount: 800,
        maximumDiscountAmount: 1000,
        usageLimit: 75,
        userUsageLimit: 1,
        validFrom,
        validUntil,
        isActive: true,
        applicableCategories: ['Sarees', 'Kurtis', 'Dresses'],
        excludedCategories: [],
        createdBy: adminUser._id
      },
      {
        code: 'NEWUSER',
        description: 'Special offer for new users - 15% off',
        discountType: 'percentage',
        discountValue: 15,
        minimumOrderAmount: 400,
        maximumDiscountAmount: 300,
        usageLimit: 150,
        userUsageLimit: 1,
        validFrom,
        validUntil,
        isActive: true,
        applicableCategories: [],
        excludedCategories: [],
        createdBy: adminUser._id
      }
    ];

    // Insert coupons
    await Coupon.insertMany(coupons);
    
    res.json({
      success: true,
      message: `${coupons.length} test coupons created successfully`,
      coupons: coupons.map(c => ({
        code: c.code,
        description: c.description,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minimumOrderAmount: c.minimumOrderAmount
      }))
    });
  } catch (error) {
    console.error('Error seeding coupons:', error);
    res.status(500).json({ error: 'Failed to seed coupons' });
  }
});

// Seed test coupons (Admin only)
router.post('/seed', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const User = mongoose.model('User');
    
    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    // Clear existing coupons
    await Coupon.deleteMany({});
    console.log('Cleared existing coupons');

    // Current date and future dates
    const now = new Date();
    const validFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
    const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    // Sample coupons
    const coupons = [
      {
        code: 'WELCOME10',
        description: 'Get 10% off on your first order',
        discountType: 'percentage',
        discountValue: 10,
        minimumOrderAmount: 500,
        maximumDiscountAmount: 200,
        usageLimit: 100,
        userUsageLimit: 1,
        validFrom,
        validUntil,
        isActive: true,
        applicableCategories: [],
        excludedCategories: [],
        createdBy: adminUser._id
      },
      {
        code: 'SAVE20',
        description: 'Save 20% on orders above ₹1000',
        discountType: 'percentage',
        discountValue: 20,
        minimumOrderAmount: 1000,
        maximumDiscountAmount: 500,
        usageLimit: 50,
        userUsageLimit: 2,
        validFrom,
        validUntil,
        isActive: true,
        applicableCategories: [],
        excludedCategories: [],
        createdBy: adminUser._id
      },
      {
        code: 'FLAT100',
        description: 'Flat ₹100 off on minimum order of ₹300',
        discountType: 'fixed',
        discountValue: 100,
        minimumOrderAmount: 300,
        usageLimit: 200,
        userUsageLimit: 3,
        validFrom,
        validUntil,
        isActive: true,
        applicableCategories: [],
        excludedCategories: [],
        createdBy: adminUser._id
      },
      {
        code: 'FESTIVE50',
        description: 'Festive offer - 50% off on selected categories',
        discountType: 'percentage',
        discountValue: 50,
        minimumOrderAmount: 800,
        maximumDiscountAmount: 1000,
        usageLimit: 75,
        userUsageLimit: 1,
        validFrom,
        validUntil,
        isActive: true,
        applicableCategories: ['Sarees', 'Kurtis', 'Dresses'],
        excludedCategories: [],
        createdBy: adminUser._id
      },
      {
        code: 'NEWUSER',
        description: 'Special offer for new users - 15% off',
        discountType: 'percentage',
        discountValue: 15,
        minimumOrderAmount: 400,
        maximumDiscountAmount: 300,
        usageLimit: 150,
        userUsageLimit: 1,
        validFrom,
        validUntil,
        isActive: true,
        applicableCategories: [],
        excludedCategories: [],
        createdBy: adminUser._id
      }
    ];

    // Insert coupons
    await Coupon.insertMany(coupons);
    
    res.json({
      success: true,
      message: `${coupons.length} test coupons created successfully`,
      coupons: coupons.map(c => ({
        code: c.code,
        description: c.description,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minimumOrderAmount: c.minimumOrderAmount
      }))
    });
  } catch (error) {
    console.error('Error seeding coupons:', error);
    res.status(500).json({ error: 'Failed to seed coupons' });
  }
});

export default router;
