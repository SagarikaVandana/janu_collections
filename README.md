# Janu Collections - Full Stack E-commerce Website

A comprehensive e-commerce platform for women's fashion built with React.js, Node.js, Express.js, and MongoDB.

## 🚀 Features

### User Features
- **Homepage**: Hero banner, featured products, category showcase
- **Product Catalog**: Browse by categories (Sarees, Kurtis, Western, Ethnic, Accessories)
- **Product Details**: High-quality images, descriptions, size selection, reviews
- **Shopping Cart**: Add/remove items, quantity management, price calculation
- **Secure Checkout**: Stripe payment integration, order confirmation
- **User Authentication**: JWT-based login/signup system
- **Order Management**: Order history, tracking, status updates
- **Responsive Design**: Mobile-first approach, works on all devices

### Admin Features
- **Admin Dashboard**: Sales analytics, order statistics, recent activities
- **Product Management**: Add, edit, delete products with image uploads
- **Order Management**: View orders, update status, track shipments
- **User Management**: View customer information and order history

### Technical Features
- **Security**: Helmet.js, rate limiting, input validation, JWT authentication
- **Performance**: Image optimization, lazy loading, pagination
- **Database**: MongoDB with Mongoose ODM, proper indexing
- **Payment**: Stripe integration for secure payments
- **Email**: Order confirmations and notifications
- **Search & Filter**: Advanced product filtering and search

## 🛠 Tech Stack

### Frontend
- **React.js 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Framer Motion** - Smooth animations
- **React Hot Toast** - Beautiful notifications
- **Stripe React** - Payment processing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Stripe** - Payment processing
- **Multer** - File upload handling
- **Helmet** - Security middleware

## 📁 Project Structure

```
janu-collections/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context for state management
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Express backend application
│   ├── models/              # Mongoose data models
│   ├── routes/              # Express route handlers
│   ├── middleware/          # Custom middleware
│   ├── scripts/             # Database scripts
│   └── package.json
├── uploads/                 # File upload directory
├── .env.example            # Environment variables template
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Stripe account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd janu-collections
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/janu-collections
   JWT_SECRET=your-super-secret-jwt-key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

4. **Set up the database**
   ```bash
   # Seed the database with sample products
   cd backend && npm run seed
   ```

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run server  # Backend only (port 5000)
   npm run client  # Frontend only (port 3000)
   ```

6. **Create admin user** (Optional)
   - Register a regular user account
   - Manually update the user in MongoDB to set `isAdmin: true`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/janu-collections

# JWT Secret (use a strong, random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Stripe Keys (get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Database Setup

1. **Local MongoDB**
   - Install MongoDB on your system
   - Start MongoDB service
   - Use the local connection string

2. **MongoDB Atlas (Recommended for production)**
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Get your connection string
   - Replace the MONGODB_URI in your `.env` file

### Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add the keys to your `.env` file
4. For production, use live keys instead of test keys

## 📱 Usage

### User Flow
1. **Browse Products**: Visit the homepage and explore categories
2. **Product Details**: Click on any product to view details
3. **Add to Cart**: Select size and add products to cart
4. **Register/Login**: Create an account or login
5. **Checkout**: Provide shipping information and pay with Stripe
6. **Order Tracking**: View order status and history in profile

### Admin Flow
1. **Admin Login**: Use admin credentials at `/admin/login`
2. **Dashboard**: View sales statistics and recent orders
3. **Manage Products**: Add, edit, or delete products
4. **Manage Orders**: Update order status and tracking information

## 🚀 Deployment

### Frontend (Vercel)

1. **Build the frontend**
   ```bash
   cd frontend && npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set build command: `cd frontend && npm run build`
   - Set output directory: `frontend/dist`
   - Add environment variables in Vercel dashboard

### Backend (Railway/Render)

1. **Prepare for deployment**
   - Ensure all environment variables are set
   - Update CORS settings for production frontend URL

2. **Deploy to Railway**
   - Connect GitHub repository
   - Railway will auto-detect Node.js app
   - Add environment variables
   - Set start command: `cd backend && npm start`

3. **Deploy to Render**
   - Create new Web Service
   - Connect GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`

### Database (MongoDB Atlas)

1. **Production Database**
   - Create a production cluster
   - Update connection string in environment variables
   - Set up database users and network access

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Product browsing and filtering
- [ ] Add to cart functionality
- [ ] Checkout process with Stripe
- [ ] Order management
- [ ] Admin product management
- [ ] Admin order management
- [ ] Responsive design on mobile devices

## 🔐 Security Features

- **Authentication**: JWT-based secure authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Express-validator for request validation
- **Security Headers**: Helmet.js for security headers
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configured for specific origins
- **Environment Variables**: Sensitive data in environment variables

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Product Endpoints
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category

### Order Endpoints
- `POST /api/orders/create-payment-intent` - Create Stripe payment intent
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

### Admin Endpoints
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders (admin)
- `PUT /api/admin/orders/:id` - Update order status

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check network access for MongoDB Atlas

2. **Stripe Payment Issues**
   - Verify Stripe keys are correct
   - Check if using test keys in development
   - Ensure webhook endpoints are configured

3. **CORS Errors**
   - Verify frontend URL in backend CORS configuration
   - Check if requests are being made to correct backend URL

4. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check for TypeScript errors in frontend
   - Verify all environment variables are set

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the troubleshooting section

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React.js team for the amazing frontend framework
- MongoDB team for the excellent database solution
- Stripe for secure payment processing
- All the open-source contributors who made this project possible

---

**Happy Coding! 🚀**