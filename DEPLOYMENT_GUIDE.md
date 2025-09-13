# 🚀 Deployment Guide for Janu Collections

This guide provides step-by-step instructions for deploying your e-commerce application to production.

## 📋 Pre-Deployment Checklist

### ✅ **COMPLETED FIXES**
- [x] Fixed backend package.json production scripts
- [x] Removed hardcoded localhost URLs
- [x] Fixed CORS configuration for production
- [x] Added environment-based configuration
- [x] Fixed static file serving paths
- [x] Added security middleware (Helmet)
- [x] Enhanced rate limiting configuration
- [x] Created comprehensive environment examples

## 🌐 **Deployment Options**

### **Option 1: Netlify (Frontend) + Railway/Render (Backend)**

#### **Frontend Deployment (Netlify)**
1. **Build the frontend:**
   ```bash
   cd project/frontend
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard:
     ```
     VITE_API_URL=https://your-backend-url.com
     VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
     ```

#### **Backend Deployment (Railway/Render)**
1. **Set environment variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://prod_user:prod_pass@cluster.mongodb.net/prod_db
   JWT_SECRET=your-super-secure-jwt-secret-minimum-32-chars
   FRONTEND_URL=https://your-netlify-domain.netlify.app
   UPLOADS_PATH=/app/uploads
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=secure_admin_password
   ADMIN_NAME=Admin User
   ```

2. **Deploy commands:**
   ```bash
   # Build command (if needed)
   npm install
   
   # Start command
   npm start
   ```

### **Option 2: Vercel (Full Stack)**

#### **Frontend (Vercel)**
1. **Configure vercel.json:**
   ```json
   {
     "builds": [
       {
         "src": "project/frontend/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/project/backend/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "/project/frontend/dist/$1"
       }
     ]
   }
   ```

#### **Backend (Vercel Serverless)**
1. **Add vercel.json for serverless:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "project/backend/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "project/backend/server.js"
       }
     ]
   }
   ```

### **Option 3: Docker Deployment**

#### **Create Dockerfile for Backend:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY project/backend/package*.json ./
RUN npm ci --only=production
COPY project/backend/ ./
EXPOSE 5000
CMD ["npm", "start"]
```

#### **Create Dockerfile for Frontend:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY project/frontend/package*.json ./
RUN npm ci
COPY project/frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 **Environment Configuration**

### **Backend Environment Variables (Required)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
JWT_SECRET=minimum-32-character-secret-key
FRONTEND_URL=https://yourdomain.com
UPLOADS_PATH=/app/uploads
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure_password
ADMIN_NAME=Admin User
```

### **Frontend Environment Variables (Required)**
```env
VITE_API_URL=https://your-backend-domain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
```

## 🔒 **Security Checklist**

- [x] Environment variables properly configured
- [x] CORS restricted to production domains
- [x] Helmet security headers enabled
- [x] Rate limiting configured
- [x] JWT secrets are strong and secure
- [x] Database credentials are production-ready
- [x] Admin credentials are secure

## 📊 **Post-Deployment Steps**

1. **Test the deployed application:**
   - Verify frontend loads correctly
   - Test API endpoints
   - Test admin login functionality
   - Verify database connectivity

2. **Seed admin user:**
   ```bash
   npm run seed:admin
   ```

3. **Monitor logs and performance**

4. **Set up SSL certificates (if not handled by platform)**

## 🚨 **Common Issues & Solutions**

### **CORS Errors**
- Ensure `FRONTEND_URL` environment variable matches your frontend domain exactly
- Check that both HTTP and HTTPS versions are handled

### **Database Connection Issues**
- Verify MongoDB Atlas IP whitelist includes your hosting platform's IPs
- Check MongoDB URI format and credentials

### **Build Failures**
- Ensure all dependencies are in `package.json`
- Check for environment-specific build configurations

### **File Upload Issues**
- Configure `UPLOADS_PATH` for your hosting platform
- Consider using cloud storage (AWS S3, Cloudinary) for production

## 📈 **Performance Optimization**

1. **Enable compression:**
   ```javascript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Add caching headers**
3. **Optimize database queries**
4. **Use CDN for static assets**

## 🔄 **CI/CD Pipeline (Optional)**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

---

**Your project is now deployment-ready! 🎉**

Choose your preferred deployment platform and follow the corresponding steps above.
