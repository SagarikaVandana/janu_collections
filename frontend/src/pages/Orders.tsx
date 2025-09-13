import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'shipped':
        return 'text-blue-700 bg-blue-100';
      case 'delivered':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order._id} className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  {getStatusIcon(order.status)}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total: ₹{order.totalAmount}</span>
                  <div className="space-x-3">
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      Track Order
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;