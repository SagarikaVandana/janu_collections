#!/usr/bin/env node

/**
 * Test script to verify API connectivity after deployment
 * This script tests the basic API endpoints to ensure the deployment is working correctly
 */

import axios from 'axios';

// Configuration
const DEPLOYMENT_URL = process.argv[2] || 'http://localhost:10000';
const BASE_URL = DEPLOYMENT_URL;

console.log(`🚀 Testing deployment connectivity at: ${BASE_URL}`);
console.log('=' .repeat(60));

// Test health endpoint
async function testHealthEndpoint() {
  try {
    console.log('🔍 Testing Health Endpoint...');
    const response = await axios.get(`${BASE_URL}/api/health`, {
      timeout: 10000
    });
    console.log('✅ Health Check:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.response?.data || error.message);
    return false;
  }
}

// Test products endpoint (public)
async function testProductsEndpoint() {
  try {
    console.log('🔍 Testing Products Endpoint...');
    const response = await axios.get(`${BASE_URL}/api/products`, {
      timeout: 10000
    });
    console.log('✅ Products API:', `Found ${response.data.length} products`);
    return true;
  } catch (error) {
    console.error('❌ Products API Failed:', error.response?.data || error.message);
    return false;
  }
}

// Test admin login
async function testAdminLogin() {
  try {
    console.log('🔍 Testing Admin Login...');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'jhansi.vandana1@gmail.com',
      password: 'Janu@123'
    }, {
      timeout: 10000
    });
    console.log('✅ Admin Login:', 'Successfully authenticated');
    return response.data.token;
  } catch (error) {
    console.error('❌ Admin Login Failed:', error.response?.data || error.message);
    return null;
  }
}

// Test frontend static files
async function testFrontendStatic() {
  try {
    console.log('🔍 Testing Frontend Static Files...');
    const response = await axios.get(`${BASE_URL}/`, {
      timeout: 10000,
      headers: {
        'Accept': 'text/html'
      }
    });
    
    if (response.data.includes('<title>') && response.data.includes('Janu Collections')) {
      console.log('✅ Frontend Static Files:', 'HTML page loaded successfully');
      return true;
    } else {
      console.log('⚠️ Frontend Static Files:', 'HTML loaded but may not be the correct page');
      return false;
    }
  } catch (error) {
    console.error('❌ Frontend Static Files Failed:', error.response?.data || error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log(`📋 Running deployment connectivity tests...`);
  console.log();
  
  const results = {
    health: await testHealthEndpoint(),
    products: await testProductsEndpoint(),
    adminLogin: await testAdminLogin(),
    frontend: await testFrontendStatic()
  };
  
  console.log();
  console.log('📊 Test Results Summary:');
  console.log('=' .repeat(60));
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${test.charAt(0).toUpperCase() + test.slice(1)} Test`);
  });
  
  console.log();
  console.log(`🎯 Overall Result: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Deployment is working correctly.');
    process.exit(0);
  } else {
    console.log('⚠️ Some tests failed. Please check the deployment configuration.');
    process.exit(1);
  }
}

// Handle command line usage
if (process.argv.length > 3) {
  console.log('Usage: node test-deployment-connectivity.js [DEPLOYMENT_URL]');
  console.log('Example: node test-deployment-connectivity.js https://your-app.onrender.com');
  process.exit(1);
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test runner failed:', error.message);
  process.exit(1);
});
