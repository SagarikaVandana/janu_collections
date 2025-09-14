#!/bin/bash
set -e  # Exit on any error

# Build script for Render deployment
echo "🚀 Starting build process..."
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# List directory contents to debug
echo "Directory contents:"
ls -la

# Get the absolute path of the project root
PROJECT_ROOT=$(pwd)
echo "Project root: $PROJECT_ROOT"

# Check if we're in the right directory structure
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Expected frontend and backend directories not found"
    echo "Available directories:"
    ls -la
    exit 1
fi

# Build frontend first
echo "🎨 Building frontend..."
cd frontend
echo "Frontend directory contents:"
ls -la

# Install frontend dependencies with legacy peer deps to handle conflicts
echo "Installing frontend dependencies..."
npm install --legacy-peer-deps --production=false

# Build frontend
echo "Building frontend..."
npm run build

# Verify build output
if [ -d "dist" ]; then
    echo "✅ Frontend build successful - dist folder created"
    echo "Dist contents:"
    ls -la dist/
else
    echo "❌ Frontend build failed - no dist folder found"
    exit 1
fi

# Return to project root
cd "$PROJECT_ROOT"

# Install backend dependencies
echo "⚙️ Installing backend dependencies..."
cd backend
echo "Backend directory contents:"
ls -la

echo "Installing backend dependencies..."
npm install --legacy-peer-deps --production=false

# Verify backend installation
if [ -d "node_modules" ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Backend dependency installation failed"
    exit 1
fi

# Return to project root
cd "$PROJECT_ROOT"

echo "✅ Build process completed successfully!"
echo "Final directory structure:"
echo "Frontend dist: $(ls -la frontend/dist/ 2>/dev/null || echo 'Not found')"
echo "Backend node_modules: $(ls -la backend/node_modules/ 2>/dev/null | head -3 || echo 'Not found')"
