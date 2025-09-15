import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import paymentSettingsRoutes from './routes/paymentSettings.js';
import newsletterRoutes from './routes/newsletter.js';
import couponRoutes from './routes/coupons.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - check multiple locations
if (process.env.NODE_ENV === 'production') {
  // In production, environment variables should be set by the hosting platform
  dotenv.config();
} else {
  // In development, try to load from project root
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

const app = express();
const PORT = process.env.PORT || 5000;

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration - MUST be before routes
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? (process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : true) // Allow same-origin in production
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  // Disable problematic headers that trigger Attribution Reporting API
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Add headers to prevent Attribution Reporting API violations
app.use((req, res, next) => {
  // Explicitly disable Attribution Reporting API
  res.setHeader('Permissions-Policy', 'attribution-reporting=()');
  
  // Remove any attribution reporting headers if they exist
  res.removeHeader('Attribution-Reporting-Eligible');
  res.removeHeader('Attribution-Reporting-Support');
  res.removeHeader('Attribution-Reporting-Register-OS-Trigger');
  res.removeHeader('Attribution-Reporting-Register-OS-Source');
  res.removeHeader('Attribution-Reporting-Register-Trigger');
  res.removeHeader('Attribution-Reporting-Register-Source');
  
  // Add additional privacy-focused headers
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  next();
});

// Rate limiting with environment configuration
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 500, // Increased limit for production
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/api/health',
});

// Apply general rate limiting
app.use(limiter);

// More lenient rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 attempts per 5 minutes per IP for auth endpoints
  message: {
    error: 'Too many authentication attempts, please try again in 5 minutes.',
    retryAfter: 300
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply auth-specific rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Static files - use environment variable for uploads path in production
const uploadsPath = process.env.UPLOADS_PATH || path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// MongoDB connection
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

const connectDB = async () => {
  const maxRetries = 5;
  let retryCount = 0;
  
  const attemptConnection = async () => {
    try {
      console.log(`MongoDB connection attempt ${retryCount + 1}/${maxRetries}`);
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is required');
      }
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        retryWrites: true,
        w: 'majority'
      });
      console.log('✅ Connected to MongoDB Atlas');
      console.log('Database:', conn.connection.name);
      console.log('Host:', conn.connection.host);
      return true;
    } catch (error) {
      retryCount++;
      console.error(`❌ MongoDB connection attempt ${retryCount} failed:`, error.message);
      
      if (retryCount < maxRetries) {
        console.log(`⏳ Retrying in 3 seconds... (${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return attemptConnection();
      } else {
        console.log('⚠️ All MongoDB connection attempts failed. Using in-memory storage as fallback.');
        console.log('📝 Registration and login will work but data will be temporary.');
        return false;
      }
    }
  };
  
  return attemptConnection();
};

// Start connection attempts
connectDB();

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});

// Health check endpoint (before other routes)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment-settings', paymentSettingsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/coupons', couponRoutes);

console.log('All routes registered');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the frontend build
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  
  // Handle client-side routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
      res.status(404).json({ message: 'API route not found' });
    }
  });
} else {
  // Development mode - just handle API 404
  app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API route not found' });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});