import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import notificationService from '../services/notificationService.js';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authenticateToken, requireAdmin);

// Get all users with their addresses (admin)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build search query
    let searchQuery = { isAdmin: false };
    if (search) {
      searchQuery = {
        ...searchQuery,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { 'address.city': { $regex: search, $options: 'i' } },
          { 'address.state': { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const [users, totalUsers] = await Promise.all([
      User.find(searchQuery)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(searchQuery)
    ]);
    
    // Format addresses for better display
    const formattedUsers = users.map(user => ({
      ...user,
      formattedAddress: user.address ? 
        `${user.address.street || ''}, ${user.address.city || ''}, ${user.address.state || ''} ${user.address.pincode || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '') || 'No address provided'
        : 'No address provided',
      addressComplete: user.address && user.address.street && user.address.city && user.address.state && user.address.pincode
    }));
    
    res.json({
      users: formattedUsers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        totalUsers,
        hasNext: skip + parseInt(limit) < totalUsers,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Dashboard stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, recentOrders] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ isAdmin: false }),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email')
        .lean()
    ]);

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

// Get all products (admin)
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    
    const filter = {};
    if (category) filter.category = category.toLowerCase();
    if (search) filter.$text = { $search: search };

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.json({
      products,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalProducts,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Create product
router.post('/products', [
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['sarees', 'kurtis', 'western', 'ethnic', 'accessories']).withMessage('Invalid category'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update product
router.put('/products/:id', [
  body('name').optional().trim().isLength({ min: 2, max: 200 }),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().isIn(['sarees', 'kurtis', 'western', 'ethnic', 'accessories']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Get all orders (admin)
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let query = Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    if (search) {
      // For simplicity, search by order ID
      query = Order.find({ 
        ...filter,
        _id: { $regex: search, $options: 'i' }
      })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);
    }

    const orders = await query.lean();
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limitNumber);

    res.json({
      orders,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalOrders,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Update order status
router.put('/orders/:id', [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { status, trackingNumber, notes } = req.body;
    
    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes) updateData.notes = notes;
    
    // Set estimated delivery date for shipped orders
    if (status === 'shipped' && !updateData.estimatedDelivery) {
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7); // 7 days from now
      updateData.estimatedDelivery = estimatedDelivery;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send notifications when order is confirmed
    let notificationResults = null;
    if (status === 'confirmed' && order.user) {
      try {
        notificationResults = await notificationService.sendOrderConfirmationNotifications(order, order.user);
        console.log('Notifications sent:', notificationResults);
      } catch (error) {
        console.error('Error sending notifications:', error);
        // Don't fail the order update if notifications fail
      }
    }

    res.json({
      message: 'Order updated successfully',
      order,
      notifications: notificationResults,
    });
  } catch (error) {
    console.error('Update order error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Error updating order' });
  }
});

// Get single order (admin)
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get admin order error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Analytics endpoint
router.get('/analytics', async (req, res) => {
  try {
    // Get basic metrics
    const [totalProducts, totalOrders, totalUsers] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ isAdmin: false })
    ]);

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format monthly revenue data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
      month: monthNames[item._id.month - 1],
      revenue: item.revenue
    }));

    // Top products by sales
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $project: {
          name: { $arrayElemAt: ['$productInfo.name', 0] },
          sales: 1,
          revenue: 1
        }
      }
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const orderStatusObj = {};
    ordersByStatus.forEach(item => {
      orderStatusObj[item._id] = item.count;
    });

    res.json({
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      monthlyRevenue: formattedMonthlyRevenue,
      topProducts,
      ordersByStatus: orderStatusObj
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

// Reports endpoint
router.get('/reports', async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    // Calculate date range based on period
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'daily':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 30); // Last 30 days
        dateFilter = { createdAt: { $gte: yesterday } };
        break;
      case 'weekly':
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7 * 12); // Last 12 weeks
        dateFilter = { createdAt: { $gte: lastWeek } };
        break;
      case 'monthly':
        const lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 12); // Last 12 months
        dateFilter = { createdAt: { $gte: lastMonth } };
        break;
      case 'yearly':
        const lastYear = new Date(now);
        lastYear.setFullYear(lastYear.getFullYear() - 5); // Last 5 years
        dateFilter = { createdAt: { $gte: lastYear } };
        break;
    }

    // Sales Report
    const salesReport = await Order.aggregate([
      { $match: { ...dateFilter, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          customers: { $addToSet: '$user' }
        }
      },
      {
        $project: {
          date: '$_id',
          orders: 1,
          revenue: 1,
          customers: { $size: '$customers' }
        }
      },
      { $sort: { date: -1 } },
      { $limit: 30 }
    ]);

    // Inventory Report
    const inventoryReport = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'orders',
          let: { productId: '$_id' },
          pipeline: [
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            { $match: { $expr: { $eq: ['$items.product', '$$productId'] } } },
            {
              $group: {
                _id: null,
                sold: { $sum: '$items.quantity' },
                revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
              }
            }
          ],
          as: 'salesData'
        }
      },
      {
        $project: {
          product: '$name',
          stock: '$stock',
          sold: { $ifNull: [{ $arrayElemAt: ['$salesData.sold', 0] }, 0] },
          revenue: { $ifNull: [{ $arrayElemAt: ['$salesData.revenue', 0] }, 0] }
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 20 }
    ]);

    // Customer Report
    const totalCustomers = await User.countDocuments({ isAdmin: false });
    const newCustomersCount = await User.countDocuments({
      isAdmin: false,
      createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) }
    });
    
    const returningCustomers = await Order.aggregate([
      { $group: { _id: '$user', orderCount: { $sum: 1 } } },
      { $match: { orderCount: { $gt: 1 } } },
      { $count: 'returningCustomers' }
    ]);
    
    const returningCustomersCount = returningCustomers[0]?.returningCustomers || 0;
    
    const customerReport = [
      {
        segment: 'New Customers',
        count: newCustomersCount,
        percentage: Math.round((newCustomersCount / totalCustomers) * 100) || 0
      },
      {
        segment: 'Returning Customers',
        count: returningCustomersCount,
        percentage: Math.round((returningCustomersCount / totalCustomers) * 100) || 0
      },
      {
        segment: 'Total Active Customers',
        count: totalCustomers,
        percentage: 100
      }
    ];

    // Financial Summary
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const financialSummary = {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalExpenses: Math.round((totalRevenue[0]?.total || 0) * 0.6), // Estimated 60% expenses
      netProfit: Math.round((totalRevenue[0]?.total || 0) * 0.4), // Estimated 40% profit
      profitMargin: 40 // Estimated 40% profit margin
    };

    res.json({
      salesReport,
      inventoryReport,
      customerReport,
      financialSummary
    });
  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({ message: 'Error fetching reports data' });
  }
});

export default router;