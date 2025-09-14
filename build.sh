#!/bin/bash

# Build script for Render deployment
echo "Starting build process..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Build process completed successfully!"
