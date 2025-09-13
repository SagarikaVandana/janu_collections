import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { 
  Mail, 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Download,
  BarChart3
} from 'lucide-react';

interface NewsletterSubscription {
  _id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  lastEmailSent?: string;
  source: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

interface NewsletterStats {
  totalSubscribers: number;
  totalUnsubscribed: number;
  totalEmails: number;
  recentSubscriptions: NewsletterSubscription[];
  monthlyStats: Array<{
    _id: string;
    count: number;
  }>;
}

const AdminNewsletter: React.FC = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_BASE_URL = '/api';

  useEffect(() => {
    fetchNewsletterData();
  }, [currentPage, searchQuery, statusFilter]);

  const fetchNewsletterData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      // Fetch subscriptions
      const subscriptionsResponse = await axios.get(`${API_BASE_URL}/newsletter/admin`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: 20,
          search: searchQuery,
          status: statusFilter
        }
      });

      setSubscriptions(subscriptionsResponse.data.subscriptions);
      setTotalPages(subscriptionsResponse.data.pagination.pages);

      // Fetch stats
      const statsResponse = await axios.get(`${API_BASE_URL}/newsletter/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(statsResponse.data);
    } catch (error: any) {
      console.error('Error fetching newsletter data:', error);
      setError(error.response?.data?.message || 'Error fetching newsletter data');
      toast.error('Error fetching newsletter data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubscription = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${API_BASE_URL}/newsletter/admin/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(response.data.message);
      fetchNewsletterData();
    } catch (error: any) {
      console.error('Error toggling subscription:', error);
      toast.error(error.response?.data?.message || 'Error toggling subscription');
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/newsletter/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Newsletter subscription deleted successfully');
      fetchNewsletterData();
    } catch (error: any) {
      console.error('Error deleting subscription:', error);
      toast.error(error.response?.data?.message || 'Error deleting subscription');
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Status', 'Subscribed Date', 'Source'],
      ...subscriptions.map(sub => [
        sub.email,
        sub.isActive ? 'Active' : 'Inactive',
        new Date(sub.subscribedAt).toLocaleDateString(),
        sub.source
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'newsletter-subscribers.csv';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchNewsletterData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter Management</h1>
          <p className="text-gray-600">Manage email subscriptions and view newsletter statistics</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSubscribers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-red-500">
                  <UserX className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unsubscribed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUnsubscribed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-500">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Emails</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEmails}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-500">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.monthlyStats.reduce((sum, stat) => sum + stat.count, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              onClick={exportSubscribers}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Newsletter Subscriptions ({subscriptions.length})
            </h2>
          </div>
          
          {subscriptions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No newsletter subscriptions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((subscription) => (
                    <tr key={subscription._id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subscription.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscription.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(subscription.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                        {subscription.source}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleSubscription(subscription._id)}
                            className={`text-sm font-medium ${
                              subscription.isActive 
                                ? 'text-orange-600 hover:text-orange-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={subscription.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {subscription.isActive ? (
                              <ToggleLeft className="h-4 w-4" />
                            ) : (
                              <ToggleRight className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteSubscription(subscription._id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletter; 