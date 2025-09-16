import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minimumOrderAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  maximumDiscountAmount: {
    type: Number,
    default: null,
    min: 0
  },
  usageLimit: {
    type: Number,
    default: null,
    min: 1
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  userUsageLimit: {
    type: Number,
    default: 1,
    min: 1
  },
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCategories: [{
    type: String,
    trim: true
  }],
  excludedCategories: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderAmount: {
      type: Number,
      required: true
    },
    discountAmount: {
      type: Number,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
couponSchema.index({ createdBy: 1 });

// Virtual for checking if coupon is currently valid
couponSchema.virtual('isCurrentlyValid').get(function() {
  const now = new Date();
  const nowUTC = new Date(now.toISOString());
  return this.isActive && 
         this.validFrom <= nowUTC && 
         this.validUntil >= nowUTC &&
         (this.usageLimit === null || this.usedCount < this.usageLimit);
});

// Method to check if user can use this coupon
couponSchema.methods.canUserUseCoupon = function(userId) {
  if (!this.isCurrentlyValid) return false;
  
  const userUsages = this.usedBy.filter(usage => 
    usage.user.toString() === userId.toString()
  );
  
  return userUsages.length < this.userUsageLimit;
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function(orderAmount) {
  if (orderAmount < this.minimumOrderAmount) {
    return 0;
  }
  
  let discountAmount = 0;
  
  if (this.discountType === 'percentage') {
    discountAmount = (orderAmount * this.discountValue) / 100;
    
    // Apply maximum discount limit if set
    if (this.maximumDiscountAmount && discountAmount > this.maximumDiscountAmount) {
      discountAmount = this.maximumDiscountAmount;
    }
  } else if (this.discountType === 'fixed') {
    discountAmount = this.discountValue;
    
    // Don't allow discount to exceed order amount
    if (discountAmount > orderAmount) {
      discountAmount = orderAmount;
    }
  }
  
  return Math.round(discountAmount * 100) / 100; // Round to 2 decimal places
};

// Method to use coupon
couponSchema.methods.useCoupon = function(userId, orderAmount, discountAmount) {
  this.usedCount += 1;
  this.usedBy.push({
    user: userId,
    orderAmount: orderAmount,
    discountAmount: discountAmount
  });
  
  return this.save();
};

// Static method to find valid coupons
couponSchema.statics.findValidCoupons = function() {
  const now = new Date();
  const nowUTC = new Date(now.toISOString());
  return this.find({
    isActive: true,
    validFrom: { $lte: nowUTC },
    validUntil: { $gte: nowUTC },
    $or: [
      { usageLimit: null },
      { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
    ]
  });
};

export default mongoose.model('Coupon', couponSchema);
