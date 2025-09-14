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
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting with environment configuration
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment-settings', paymentSettingsRoutes);
app.use('/api/newsletter', newsletterRoutes);

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