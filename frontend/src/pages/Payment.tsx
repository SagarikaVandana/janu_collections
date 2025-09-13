import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Banknote, Smartphone, ArrowRight, Receipt, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

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

const Payment: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionNumber, setTransactionNumber] = useState('');
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [upiId, setUpiId] = useState<string>('');
  const [upiName, setUpiName] = useState<string>('');
  const [upiLoading, setUpiLoading] = useState<boolean>(false);
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [bankLoading, setBankLoading] = useState<boolean>(false);
  const [showUPIQR, setShowUPIQR] = useState<boolean>(false);

  const API_BASE_URL = '/api';

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is required');
      setLoading(false);
      return;
    }

    fetchOrder();
  }, [orderId]);

  // Fetch payment settings for bank transfer and UPI
  useEffect(() => {
    if (order?.paymentMethod === 'bank_transfer' || order?.paymentMethod === 'upi') {
      setBankLoading(true);
      axios.get('/api/payment-settings')
        .then(res => {
          setBankDetails(res.data);
          if (order?.paymentMethod === 'upi') {
            setUpiId(res.data.upiId || '');
            setUpiName(res.data.upiName || '');
          }
        })
        .catch(() => {
          setBankDetails(null);
          setUpiId('');
          setUpiName('');
        })
        .finally(() => setBankLoading(false));
    }
  }, [order?.paymentMethod]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
      setOrder(response.data);
    } catch (error: any) {
      console.error('Error fetching order:', error);
      setError(error.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionNumber.trim()) {
      toast.error('Please enter your transaction number');
      return;
    }

    setConfirmingPayment(true);

    try {
      // Update order with transaction number
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/confirm-payment`, {
        transactionNumber: transactionNumber.trim()
      });

      if (response.status === 200) {
        setPaymentConfirmed(true);
        toast.success('Payment confirmed successfully!');
        
        // Redirect to order success page after a short delay
        setTimeout(() => {
          navigate(`/order-success/${orderId}`);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error confirming payment:', error);
      toast.error(error.response?.data?.message || 'Failed to confirm payment');
    } finally {
      setConfirmingPayment(false);
    }
  };

  const generateUPIQRCode = () => {
    if (!order || !bankDetails?.upiId) {
      toast.error('UPI details not available');
      return;
    }
    setShowUPIQR(true);
  };

  const getPaymentInstructions = () => {
    if (order?.paymentMethod === 'bank_transfer' && bankDetails) {
      return {
        title: 'Bank Transfer Instructions',
        steps: [
          `Transfer ₹${order?.totalAmount} to our bank account`,
          `Account Name: ${bankDetails.accountHolderName}`,
          `Account Number: ${bankDetails.accountNumber}`,
          `IFSC Code: ${bankDetails.ifscCode}`,
          `Bank: ${bankDetails.bankName}` + (bankDetails.branchName ? `, Branch: ${bankDetails.branchName}` : ''),
          'After transfer, enter the transaction number below'
        ]
      };
    }
    if (order?.paymentMethod === 'upi' && bankDetails) {
      return {
        title: 'UPI Payment Instructions',
        steps: [
          `Pay ₹${order?.totalAmount} using UPI`,
          `UPI ID: ${bankDetails.upiId}`,
          'Click "Generate QR Code" to scan and pay',
          'After payment, enter the transaction number below'
        ]
      };
    }
    return {
      title: 'Payment Instructions',
      steps: [
        'Complete your payment using the method above',
        'Enter the transaction number to confirm your order'
      ]
    };
  };

  const generateUPIURL = () => {
    if (!order || !bankDetails?.upiId) return '';
    
    const amount = order.totalAmount;
    const upiName = bankDetails.upiName || 'Janu Collection';
    const upiId = bankDetails.upiId;
    
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=Order-${order._id.slice(-8)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (paymentConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmed!</h2>
          <p className="text-gray-600">Your order has been confirmed. Redirecting to order details...</p>
        </motion.div>
      </div>
    );
  }

  const paymentInstructions = getPaymentInstructions();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Order #{order._id.slice(-8)}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Instructions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center mb-4">
              {order.paymentMethod === 'bank_transfer' && <Banknote className="h-6 w-6 text-blue-600 mr-2" />}
              {order.paymentMethod === 'upi' && <Smartphone className="h-6 w-6 text-green-600 mr-2" />}
              {order.paymentMethod === 'stripe' && <CreditCard className="h-6 w-6 text-purple-600 mr-2" />}
              <h2 className="text-xl font-semibold text-gray-900">{paymentInstructions.title}</h2>
            </div>

            <div className="space-y-4">
              {paymentInstructions.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>

            {/* UPI QR Code Generator */}
            {order.paymentMethod === 'upi' && bankDetails && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-green-900">UPI QR Code</h3>
                  <button
                    onClick={generateUPIQRCode}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>Generate QR Code</span>
                  </button>
                </div>
                
                {showUPIQR && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-white border rounded-lg">
                        <QRCodeSVG 
                          value={generateUPIURL()}
                          size={256}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-green-700 mb-2">
                        <strong>Amount:</strong> ₹{order.totalAmount}
                      </p>
                      <p className="text-sm text-green-700 mb-2">
                        <strong>UPI ID:</strong> {bankDetails.upiId}
                      </p>
                      {bankDetails.upiName && (
                        <p className="text-sm text-green-700">
                          <strong>Account Name:</strong> {bankDetails.upiName}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-green-600 text-center">
                      Open any UPI app (Google Pay, PhonePe, Paytm, etc.) and scan this QR code to complete your payment.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Details */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Total:</span>
                  <span className="font-medium">₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Bank Account Details for Bank Transfer */}
            {order.paymentMethod === 'bank_transfer' && bankDetails && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Bank Account Details</h3>
                <div className="space-y-1 text-sm">
                  <div>Account Name: <span className="font-medium">{bankDetails.accountHolderName}</span></div>
                  <div>Account Number: <span className="font-medium">{bankDetails.accountNumber}</span></div>
                  <div>IFSC Code: <span className="font-medium">{bankDetails.ifscCode}</span></div>
                  <div>Bank: <span className="font-medium">{bankDetails.bankName}</span>{bankDetails.branchName && `, Branch: ${bankDetails.branchName}`}</div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Transaction Confirmation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center mb-4">
              <Receipt className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Confirm Payment</h2>
            </div>

            <form onSubmit={handlePaymentConfirmation} className="space-y-4">
              <div>
                <label htmlFor="transactionNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Number *
                </label>
                <input
                  type="text"
                  id="transactionNumber"
                  value={transactionNumber}
                  onChange={(e) => setTransactionNumber(e.target.value)}
                  placeholder="Enter your payment transaction number"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This helps us verify your payment and process your order faster
                </p>
              </div>

              <button
                type="submit"
                disabled={confirmingPayment || !transactionNumber.trim()}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {confirmingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Confirm Payment</span>
                  </>
                )}
              </button>
            </form>

            {/* Order Summary */}
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} (Size: {item.size}) x {item.quantity}
                    </span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <p className="font-medium mb-1">Can't find transaction number?</p>
              <p>Check your payment app or bank statement for the transaction ID or reference number.</p>
            </div>
            <div>
              <p className="font-medium mb-1">Payment not working?</p>
              <p>Contact us at +91 9391235258 or janucollectionvizag@gmail.com for assistance.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment; 