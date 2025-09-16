import mongoose from 'mongoose';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedCoupons = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/janu_collections');
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('Admin user not found');
      return;
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
    console.log(`${coupons.length} coupons created successfully`);

    // List created coupons
    const createdCoupons = await Coupon.find().populate('createdBy', 'name email');
    console.log('\nCreated Coupons:');
    createdCoupons.forEach(coupon => {
      console.log(`- ${coupon.code}: ${coupon.description} (${coupon.discountType} - ${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : '₹'})`);
    });

    console.log('\nCoupon seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding coupons:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the seed function
seedCoupons();
