import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, Package } from 'lucide-react';
import axios from 'axios';

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    monthlyRevenue: [] as Array<{ month: string; revenue: number }>,
    topProducts: [] as Array<{ name: string; sales: number; revenue: number }>,
    ordersByStatus: {} as Record<string, number>,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      console.log('AdminAnalytics: Making API call to /api/admin/analytics');
      const response = await axios.get('/api/admin/analytics');
      console.log('AdminAnalytics: API response received', response.data);
      setAnalytics(response.data);
    } catch (error) {
      console.error('AdminAnalytics: Error fetching analytics:', error);
      // Mock data for demonstration
      setAnalytics({
        totalRevenue: 125000,
        totalOrders: 450,
        totalUsers: 1200,
        totalProducts: 85,
        monthlyRevenue: [
          { month: 'Jan', revenue: 15000 },
          { month: 'Feb', revenue: 18000 },
          { month: 'Mar', revenue: 22000 },
          { month: 'Apr', revenue: 19000 },
          { month: 'May', revenue: 25000 },
          { month: 'Jun', revenue: 26000 },
        ],
        topProducts: [
          { name: 'Ethnic Kurta Set', sales: 45, revenue: 22500 },
          { name: 'Designer Saree', sales: 38, revenue: 19000 },
          { name: 'Western Dress', sales: 32, revenue: 16000 },
        ],
        ordersByStatus: {
          pending: 12,
          processing: 8,
          shipped: 15,
          delivered: 380,
          cancelled: 5,
        },
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights into your business performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{analytics.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalProducts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
          <div className="space-y-4">
            {analytics.monthlyRevenue.map((item: any, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{item.month}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${(item.revenue / Math.max(...analytics.monthlyRevenue.map((m: any) => m.revenue))) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="font-semibold">₹{item.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-4">
            {analytics.topProducts.map((product: any, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} sales</p>
                </div>
                <span className="font-semibold">₹{product.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status</h2>
          <div className="space-y-3">
            {Object.entries(analytics.ordersByStatus).map(([status, count]: [string, any]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="capitalize text-gray-600">{status}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Order Value</span>
              <span className="font-semibold">₹{Math.round(analytics.totalRevenue / analytics.totalOrders).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-semibold">3.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Customer Retention</span>
              <span className="font-semibold">68%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Return Rate</span>
              <span className="font-semibold">2.1%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
