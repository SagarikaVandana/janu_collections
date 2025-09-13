import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Order {
  _id: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
  }>;
  totalAmount: number;
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  transactionNumber?: string;
  status: string;
  createdAt: string;
}

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your purchase. We'll process your order soon.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Order ID:</span>
                <p className="text-gray-900 font-mono">{order._id}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Order Date:</span>
                <p className="text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Payment Method:</span>
                <p className="text-gray-900 capitalize">{order.paymentMethod.replace('_', ' ')}</p>
              </div>

              {order.transactionNumber && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Transaction Number:</span>
                  <p className="text-gray-900 font-mono">{order.transactionNumber}</p>
                </div>
              )}

              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Total Amount:</span>
                <p className="text-gray-900 text-lg font-semibold">₹{order.totalAmount}</p>
              </div>
            </div>
          </motion.div>

          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <p className="text-gray-900">{order.shippingInfo.fullName}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{order.shippingInfo.email}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Phone:</span>
                <p className="text-gray-900">{order.shippingInfo.phone}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Address:</span>
                <p className="text-gray-900">
                  {order.shippingInfo.address}<br />
                  {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.pincode}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-lg shadow-md p-6 mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
          
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8"
        >
          <h2 className="text-lg font-semibold text-blue-900 mb-4">What's Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Order Processing</h3>
                <p className="text-sm text-blue-800 mt-1">
                  We'll review your order and prepare it for shipping.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Shipping</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Your order will be shipped within 2-3 business days.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Delivery</h3>
                <p className="text-sm text-blue-800 mt-1">
                  You'll receive updates about your delivery status.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <Link
            to="/orders"
            className="flex-1 btn-secondary flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>View My Orders</span>
          </Link>
          
          <Link
            to="/"
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;