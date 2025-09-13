import React, { useState, useEffect } from 'react';
import { Download, Calendar, Filter, TrendingUp, FileText } from 'lucide-react';
import axios from 'axios';

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState({
    salesReport: [] as Array<{ date: string; orders: number; revenue: number; customers: number }>,
    inventoryReport: [] as Array<{ product: string; stock: number; sold: number; revenue: number }>,
    customerReport: [] as Array<{ segment: string; count: number; percentage: number }>,
    financialSummary: {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      profitMargin: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState('sales');

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`/api/admin/reports?period=${selectedPeriod}`);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Mock data for demonstration
      setReports({
        salesReport: [
          { date: '2024-01-01', orders: 45, revenue: 22500, customers: 38 },
          { date: '2024-01-02', orders: 52, revenue: 26000, customers: 42 },
          { date: '2024-01-03', orders: 38, revenue: 19000, customers: 35 },
          { date: '2024-01-04', orders: 61, revenue: 30500, customers: 48 },
          { date: '2024-01-05', orders: 43, revenue: 21500, customers: 36 },
        ],
        inventoryReport: [
          { product: 'Ethnic Kurta Set', stock: 25, sold: 45, revenue: 22500 },
          { product: 'Designer Saree', stock: 18, sold: 38, revenue: 19000 },
          { product: 'Western Dress', stock: 32, sold: 32, revenue: 16000 },
          { product: 'Traditional Lehenga', stock: 12, sold: 28, revenue: 14000 },
        ],
        customerReport: [
          { segment: 'New Customers', count: 245, percentage: 35 },
          { segment: 'Returning Customers', count: 456, percentage: 65 },
          { segment: 'Premium Customers', count: 89, percentage: 13 },
          { segment: 'Inactive Customers', count: 123, percentage: 18 },
        ],
        financialSummary: {
          totalRevenue: 125000,
          totalExpenses: 75000,
          netProfit: 50000,
          profitMargin: 40,
        },
      });
    }
    setLoading(false);
  };

  const downloadReport = (reportType: string) => {
    // Mock download functionality
    const data = reports[reportType as keyof typeof reports];
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(data[0] || {}).join(",") + "\n" +
      (Array.isArray(data) ? data.map(row => Object.values(row).join(",")).join("\n") : "");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
        <p className="text-gray-600">Generate and download comprehensive business reports</p>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="sales">Sales Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="customer">Customer Report</option>
              <option value="financial">Financial Summary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{reports.financialSummary.totalRevenue?.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">₹{reports.financialSummary.totalExpenses?.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-500 transform rotate-180" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-blue-600">₹{reports.financialSummary.netProfit?.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-purple-600">{reports.financialSummary.profitMargin}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Report */}
        {selectedReport === 'sales' && (
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Sales Report</h2>
                <button
                  onClick={() => downloadReport('salesReport')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customers</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.salesReport.map((row: any, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(row.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.orders}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{row.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.customers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Report */}
        {selectedReport === 'inventory' && (
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Inventory Report</h2>
                <button
                  onClick={() => downloadReport('inventoryReport')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.inventoryReport.map((row: any, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.product}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 rounded-full text-xs ${row.stock < 20 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {row.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.sold}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{row.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Customer Report */}
        {selectedReport === 'customer' && (
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Customer Report</h2>
                <button
                  onClick={() => downloadReport('customerReport')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </button>
              </div>
              
              <div className="space-y-4">
                {reports.customerReport.map((segment: any, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{segment.segment}</h3>
                      <p className="text-sm text-gray-600">{segment.count} customers</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary-600">{segment.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
