import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const BASE_URL = 'http://localhost:5000';

// Test admin login and get token
async function getAdminToken() {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'jhansi.vandana1@gmail.com',
      password: 'Janu@123'
    });
    return response.data.token;
  } catch (error) {
    console.error('Failed to get admin token:', error.response?.data || error.message);
    return null;
  }
}

// Test analytics endpoint
async function testAnalyticsEndpoint(token) {
  try {
    console.log('🔍 Testing Analytics Endpoint...');
    const response = await axios.get(`${BASE_URL}/api/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Analytics API Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Analytics API Error:', error.response?.data || error.message);
    return false;
  }
}

// Test reports endpoint
async function testReportsEndpoint(token) {
  try {
    console.log('🔍 Testing Reports Endpoint...');
    const response = await axios.get(`${BASE_URL}/api/admin/reports?period=monthly`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Reports API Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Reports API Error:', error.response?.data || error.message);
    return false;
  }
}

// Test dashboard stats endpoint
async function testDashboardStatsEndpoint(token) {
  try {
    console.log('🔍 Testing Dashboard Stats Endpoint...');
    const response = await axios.get(`${BASE_URL}/api/admin/dashboard-stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Dashboard Stats API Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Dashboard Stats API Error:', error.response?.data || error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting API Endpoint Tests...\n');
  
  // Get admin token
  console.log('🔐 Getting admin authentication token...');
  const token = await getAdminToken();
  
  if (!token) {
    console.error('❌ Failed to get admin token. Cannot proceed with tests.');
    process.exit(1);
  }
  
  console.log('✅ Admin token obtained successfully\n');
  
  // Test all endpoints
  const results = {
    analytics: await testAnalyticsEndpoint(token),
    reports: await testReportsEndpoint(token),
    dashboardStats: await testDashboardStatsEndpoint(token)
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('Analytics Endpoint:', results.analytics ? '✅ PASS' : '❌ FAIL');
  console.log('Reports Endpoint:', results.reports ? '✅ PASS' : '❌ FAIL');
  console.log('Dashboard Stats Endpoint:', results.dashboardStats ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = Object.values(results).every(result => result);
  console.log('\nOverall Status:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  process.exit(allPassed ? 0 : 1);
}

runTests();
