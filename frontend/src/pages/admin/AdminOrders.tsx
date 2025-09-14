import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, XCircle, Eye, Edit } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    size: string;
  }>;
  totalAmount: number;
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    doorNumber?: string;
    street?: string;
    village?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  transactionNumber?: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await axios.put(`/api/admin/orders/${orderId}`, {
        status: newStatus,
      });

      // Update the order in the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Show notification status if order was confirmed
      if (newStatus === 'confirmed' && response.data.notifications) {
        const { email, sms, whatsapp } = response.data.notifications;
        let notificationMessage = 'Order confirmed successfully!';

        if (email || sms || whatsapp) {
          notificationMessage += ' Notifications sent:';
          if (email) notificationMessage += ' Email ✓';
          if (sms) notificationMessage += ' SMS ✓';
          if (whatsapp) notificationMessage += ' WhatsApp ✓';
        } else {
          notificationMessage += ' (Notifications not configured)';
        }

        toast.success(notificationMessage);
      } else {
      toast.success('Order status updated successfully');
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order._id.slice(-8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.shippingInfo.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.shippingInfo.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.map(item => item.name).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{order.totalAmount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.shippingInfo.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.shippingInfo.doorNumber && order.shippingInfo.street && order.shippingInfo.village 
                        ? `${order.shippingInfo.doorNumber}, ${order.shippingInfo.street}, ${order.shippingInfo.village}`
                        : order.shippingInfo.address || 'Address not available'
                      }
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.pincode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {order.paymentMethod.replace('_', ' ')}
                    </div>
                    {order.transactionNumber && (
                      <div className="text-xs text-gray-500 font-mono">
                        {order.transactionNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                    <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                        title="View order details"
                        aria-label="View order details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        title="Update order status"
                        aria-label="Update order status"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Order Details - #{selectedOrder._id.slice(-8)}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Order ID:</span>
                      <p className="text-gray-900 font-mono">{selectedOrder._id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Date:</span>
                      <p className="text-gray-900">
                        {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Status:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1">
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Total Amount:</span>
                      <p className="text-gray-900 font-semibold">₹{selectedOrder.totalAmount}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Payment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Payment Method:</span>
                      <p className="text-gray-900 capitalize">{selectedOrder.paymentMethod.replace('_', ' ')}</p>
                    </div>
                    {selectedOrder.transactionNumber && (
                      <div>
                        <span className="font-medium text-gray-500">Transaction Number:</span>
                        <p className="text-gray-900 font-mono">{selectedOrder.transactionNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Information */}
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Name:</span>
                      <p className="text-gray-900">{selectedOrder.shippingInfo.fullName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Email:</span>
                      <p className="text-gray-900">{selectedOrder.shippingInfo.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Phone:</span>
                      <p className="text-gray-900">{selectedOrder.shippingInfo.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Address:</span>
                      <p className="text-gray-900">
                        {selectedOrder.shippingInfo.address}<br />
                        {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state} {selectedOrder.shippingInfo.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;