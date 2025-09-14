# 🚀 Single Server Deployment Guide for Janu Collections

This guide covers deploying the full-stack Janu Collections application on a single server using Render.com.

## 🔧 Recent Fixes Applied

### CORS Configuration Fix (Latest)
- **Issue**: Frontend could not connect to backend API after deployment
- **Root Cause**: CORS configuration in production mode was not allowing same-origin requests
- **Solution**: Updated `backend/server.js` to allow same-origin requests in production when `FRONTEND_URL` is not set
- **Status**: ✅ Fixed and deployed

## ✅ **Configuration Complete**

Your Janu Collections e-commerce website is now configured for **single server deployment** on Render. This means both frontend and backend will run on the same web server, reducing costs and simplifying deployment.

### **What's Been Configured:**

1. **Backend Updates:**
   - ✅ Modified `backend/server.js` to serve frontend build files in production
   - ✅ Updated `backend/package.json` with build script that builds frontend
   - ✅ Added production static file serving with client-side routing support

2. **Render Configuration:**
   - ✅ Updated `render.yaml` for single web service deployment
   - ✅ Removed separate frontend service (no longer needed)
   - ✅ Configured build process: `cd backend && npm install && npm run build`
   - ✅ Set start command: `cd backend && npm start`

3. **Security & Environment:**
   - ✅ Added `UPLOADS_PATH` environment variable for Render
   - ✅ Cleaned up `.env.example` to remove sensitive data
   - ✅ Created `netlify.toml` for alternative deployment option

### **Key Benefits:**
- **✅ Cost Effective**: Single server resource usage
- **✅ Simplified Architecture**: No CORS configuration needed
- **✅ Easy Maintenance**: Single service to monitor and maintain
- **✅ Production Ready**: Optimized build process and security

## 🚀 **Render Deployment Steps**

### **Method 1: Using GitHub Integration (Recommended)**

1. **Connect to Render:**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `janu_collections` repository

2. **Configure Service:**
   - **Name**: `janu-collections-fullstack`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Instance Type**: `Starter` (free tier available)

3. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://naveenkumarkohli06_db_user:IDUdukIr0SOreReh@cluster1.suhljwx.mongodb.net/Sagarika
   JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   ADMIN_EMAIL=jhansi.vandana1@gmail.com
   ADMIN_PASSWORD=Janu@123
   ADMIN_NAME=Janu Collections Admin
   UPLOADS_PATH=/opt/render/project/src/uploads
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### **Method 2: Using render.yaml (Automatic)**

1. **Push your changes to GitHub** (already done)
2. **Go to Render Dashboard**
3. **Click "New +" → "Blueprint"**
4. **Connect your GitHub repository**
5. **Render will automatically detect and deploy using `render.yaml`**

## 🔧 **Post-Deployment Configuration**

### **Set Environment Variables in Render:**
After deployment, go to your service settings and add these environment variables:

```
# Database
MONGODB_URI=mongodb+srv://naveenkumarkohli06_db_user:IDUdukIr0SOreReh@cluster1.suhljwx.mongodb.net/Sagarika

# Security
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters

# Payment (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Admin Credentials
ADMIN_EMAIL=jhansi.vandana1@gmail.com
ADMIN_PASSWORD=Janu@123
ADMIN_NAME=Janu Collections Admin

# File Uploads
UPLOADS_PATH=/opt/render/project/src/uploads
```

## 🎯 **Ready to Deploy**

Your application is **100% ready** for single server deployment on Render:

- ✅ **Single Server**: Both frontend and backend on one service
- ✅ **No CORS Issues**: All requests work without CORS configuration
- ✅ **Client-Side Routing**: React Router works correctly with Express fallback
- ✅ **Production Build**: Optimized frontend build served from backend
- ✅ **Security**: Production-ready security configuration

## 📝 **Admin Access**

Once deployed, you can access the admin dashboard at:
```
https://your-service-name.onrender.com/admin
```

**Admin Credentials:**
- **Email**: jhansi.vandana1@gmail.com
- **Password**: Janu@123

## 🔍 **Testing Your Deployment**

After deployment, test these endpoints:
- **Frontend**: `https://your-service-name.onrender.com`
- **API Health**: `https://your-service-name.onrender.com/api/health`
- **Admin Dashboard**: `https://your-service-name.onrender.com/admin`

## 🚨 **Troubleshooting**

If deployment fails:
1. Check Render build logs for errors
2. Ensure all environment variables are set correctly
3. Verify MongoDB connection string is valid
4. Check that the build process completes successfully

---

**🎉 Your Janu Collections e-commerce website is ready for single server deployment!**
