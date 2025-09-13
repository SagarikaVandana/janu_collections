import axios from 'axios';

// Test function to verify API calls are working
export const testApiCalls = async () => {
  console.log('🔍 Testing Frontend API Calls...');
  
  try {
    // Test if we can reach the backend
    const healthCheck = await axios.get('/api/auth/me');
    console.log('❌ Auth check (expected to fail without token):', healthCheck.status);
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('✅ Backend is reachable (401 as expected without auth)');
    } else {
      console.log('❌ Backend connection issue:', error.message);
      return false;
    }
  }

  // Test dashboard stats endpoint (requires admin auth)
  try {
    const dashboardStats = await axios.get('/api/admin/dashboard-stats');
    console.log('✅ Dashboard stats fetched:', dashboardStats.data);
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('⚠️ Dashboard stats requires authentication (expected)');
    } else {
      console.log('❌ Dashboard stats error:', error.message);
    }
  }

  // Test analytics endpoint (requires admin auth)
  try {
    const analytics = await axios.get('/api/admin/analytics');
    console.log('✅ Analytics data fetched:', analytics.data);
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('⚠️ Analytics requires authentication (expected)');
    } else {
      console.log('❌ Analytics error:', error.message);
    }
  }

  // Test reports endpoint (requires admin auth)
  try {
    const reports = await axios.get('/api/admin/reports');
    console.log('✅ Reports data fetched:', reports.data);
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('⚠️ Reports requires authentication (expected)');
    } else {
      console.log('❌ Reports error:', error.message);
    }
  }

  return true;
};

// Function to test authenticated API calls
export const testAuthenticatedApiCalls = async (token: string) => {
  console.log('🔍 Testing Authenticated API Calls...');
  
  // Set authorization header
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  try {
    // Test dashboard stats
    const dashboardStats = await axios.get('/api/admin/dashboard-stats');
    console.log('✅ Dashboard Stats (Authenticated):', dashboardStats.data);
    
    // Test analytics
    const analytics = await axios.get('/api/admin/analytics');
    console.log('✅ Analytics (Authenticated):', analytics.data);
    
    // Test reports
    const reports = await axios.get('/api/admin/reports');
    console.log('✅ Reports (Authenticated):', reports.data);
    
    return {
      dashboardStats: dashboardStats.data,
      analytics: analytics.data,
      reports: reports.data
    };
  } catch (error: any) {
    console.error('❌ Authenticated API call failed:', error.response?.data || error.message);
    return null;
  }
};
