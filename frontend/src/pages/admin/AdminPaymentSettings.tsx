import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { QrCode, Camera, Download, Eye, EyeOff } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentSettings {
  _id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  branchName: string;
  upiId: string;
  upiName: string;
  qrCodeImage: string;
  gpayNumber: string;
  phonepeNumber: string;
  paytmNumber: string;
  paymentInstructions: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminPaymentSettings: React.FC = () => {
  const { user } = useAuth();
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    ifscCode: '',
    branchName: '',
    upiId: '',
    upiName: '',
    qrCodeImage: '',
    gpayNumber: '',
    phonepeNumber: '',
    paytmNumber: '',
    paymentInstructions: 'Please make payment to the provided UPI ID or bank account. Share the payment screenshot for order confirmation.',
  });

  const API_BASE_URL = '/api';

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/payment-settings/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Payment settings response:', response.data);
      setPaymentSettings(response.data);
    } catch (error: any) {
      console.error('Error fetching payment settings:', error);
      setError(error.response?.data?.message || 'Error fetching payment settings');
      toast.error('Error fetching payment settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.bankName || !formData.accountNumber || !formData.accountHolderName || !formData.ifscCode || !formData.upiId) {
      toast.error('Please fill in all required fields (Bank Name, Account Number, Account Holder Name, IFSC Code, and UPI ID)');
      return;
    }

    // Validate IFSC code format
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(formData.ifscCode.toUpperCase())) {
      toast.error('Invalid IFSC code format. Please enter a valid IFSC code (e.g., SBIN0001234)');
      return;
    }

    // Validate UPI ID format
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    if (!upiRegex.test(formData.upiId)) {
      toast.error('Invalid UPI ID format. Please enter a valid UPI ID (e.g., user@paytm)');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `${API_BASE_URL}/payment-settings/${editingId}`
        : `${API_BASE_URL}/payment-settings`;
      
      const method = editingId ? 'put' : 'post';
      
      const response = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Payment settings response:', response.data);
      toast.success(response.data.message);
      
      setShowForm(false);
      resetForm();
      fetchPaymentSettings();
    } catch (error: any) {
      console.error('Error saving payment settings:', error);
      toast.error(error.response?.data?.message || 'Error saving payment settings');
    }
  };

  const resetForm = () => {
    setFormData({
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
      ifscCode: '',
      branchName: '',
      upiId: '',
      upiName: '',
      qrCodeImage: '',
      gpayNumber: '',
      phonepeNumber: '',
      paytmNumber: '',
      paymentInstructions: 'Please make payment to the provided UPI ID or bank account. Share the payment screenshot for order confirmation.',
    });
    setEditingId(null);
  };

  const handleEdit = (settings: PaymentSettings) => {
    setFormData({
      bankName: settings.bankName,
      accountNumber: settings.accountNumber,
      accountHolderName: settings.accountHolderName,
      ifscCode: settings.ifscCode,
      branchName: settings.branchName || '',
      upiId: settings.upiId,
      upiName: settings.upiName || '',
      qrCodeImage: settings.qrCodeImage || '',
      gpayNumber: settings.gpayNumber || '',
      phonepeNumber: settings.phonepeNumber || '',
      paytmNumber: settings.paytmNumber || '',
      paymentInstructions: settings.paymentInstructions,
    });
    setEditingId(settings._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this payment setting?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/payment-settings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Payment settings deleted successfully');
      fetchPaymentSettings();
    } catch (error: any) {
      console.error('Error deleting payment settings:', error);
      toast.error(error.response?.data?.message || 'Error deleting payment settings');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${API_BASE_URL}/payment-settings/${id}/toggle`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message);
      fetchPaymentSettings();
    } catch (error: any) {
      console.error('Error toggling payment settings:', error);
      toast.error(error.response?.data?.message || 'Error toggling payment settings');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // QR Code Scanner Functions
  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowQRScanner(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowQRScanner(false);
    setScannedData('');
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        // Here you would typically use a QR code library to decode the image
        // For now, we'll simulate scanning
        setTimeout(() => {
          const mockScannedData = 'upi://pay?pa=janucollection@upi&pn=Janu%20Collection&am=100&cu=INR';
          setScannedData(mockScannedData);
          toast.success('QR Code scanned successfully!');
          stopScanner();
        }, 1000);
      }
    }
  };

  // QR Code Generator Functions
  const generateQRCode = () => {
    if (formData.upiId) {
      const upiUrl = `upi://pay?pa=${formData.upiId}&pn=${encodeURIComponent(formData.upiName || 'Janu Collection')}&cu=INR`;
      setQrCodeData(upiUrl);
      setShowQRGenerator(true);
    } else {
      toast.error('Please enter a UPI ID first');
    }
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
            onClick={fetchPaymentSettings}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Settings</h1>
          <p className="text-gray-600">Manage bank details, UPI IDs, and payment methods for customer payments</p>
        </div>

        {/* QR Code Scanner and Generator Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Code Scanner */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">QR Code Scanner</h3>
              <button
                onClick={showQRScanner ? stopScanner : startScanner}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {showQRScanner ? <EyeOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                <span>{showQRScanner ? 'Stop Scanner' : 'Start Scanner'}</span>
              </button>
            </div>
            
            {showQRScanner ? (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <button
                  onClick={captureFrame}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Scan QR Code
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click "Start Scanner" to scan QR codes</p>
              </div>
            )}
            
            {scannedData && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Scanned Data:</h4>
                <p className="text-sm text-green-800 break-all">{scannedData}</p>
              </div>
            )}
          </div>

          {/* QR Code Generator */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">QR Code Generator</h3>
              <button
                onClick={generateQRCode}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <QrCode className="h-4 w-4" />
                <span>Generate QR</span>
              </button>
            </div>
            
            {showQRGenerator && qrCodeData ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-white border rounded-lg">
                    <QRCodeSVG 
                      value={qrCodeData}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => {
                      const blob = new Blob([qrCodeData], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.download = 'upi-data.txt';
                      link.href = url;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download UPI Data</span>
                  </button>
                </div>
                <div className="text-sm text-gray-600 break-all">
                  <strong>UPI URL:</strong> {qrCodeData}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Enter UPI details and click "Generate QR"</p>
              </div>
            )}
          </div>
        </div>

        {/* Add New Payment Settings Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              resetForm();
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'Add New Payment Settings'}
          </button>
        </div>

        {/* Payment Settings Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Payment Settings' : 'Add New Payment Settings'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bank Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-900">Bank Account Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., State Bank of India"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 1234567890"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., SBIN0001234"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch Name
                      </label>
                      <input
                        type="text"
                        name="branchName"
                        value={formData.branchName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Main Branch"
                      />
                    </div>
                  </div>
                </div>

                {/* UPI and QR Code Details */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-900">UPI & QR Code Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UPI ID *
                      </label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., john@upi"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UPI Name
                      </label>
                      <input
                        type="text"
                        name="upiName"
                        value={formData.upiName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        QR Code Image URL
                      </label>
                      <input
                        type="url"
                        name="qrCodeImage"
                        value={formData.qrCodeImage}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/qr-code.png"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Optional: URL to QR code image for UPI payments
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Payment Methods */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-900">Additional Payment Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Google Pay Number
                    </label>
                    <input
                      type="text"
                      name="gpayNumber"
                      value={formData.gpayNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 9876543210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PhonePe Number
                    </label>
                    <input
                      type="text"
                      name="phonepeNumber"
                      value={formData.phonepeNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 9876543210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Paytm Number
                    </label>
                    <input
                      type="text"
                      name="paytmNumber"
                      value={formData.paytmNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 9876543210"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Instructions
                </label>
                <textarea
                  name="paymentInstructions"
                  value={formData.paymentInstructions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instructions for customers on how to make payments..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update Settings' : 'Save Settings'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Settings List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Payment Settings ({paymentSettings.length})</h2>
          </div>
          
          {paymentSettings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No payment settings found. Add your first payment settings to start receiving payments.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      UPI Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentSettings.map((settings) => (
                    <tr key={settings._id}>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{settings.bankName}</p>
                          <p className="text-gray-500">A/C: {settings.accountNumber}</p>
                          <p className="text-gray-500">{settings.accountHolderName}</p>
                          <p className="text-gray-500">IFSC: {settings.ifscCode}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{settings.upiId}</p>
                          <p className="text-gray-500">{settings.upiName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          settings.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {settings.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(settings)}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleActive(settings._id)}
                            className={`text-sm font-medium ${
                              settings.isActive 
                                ? 'text-orange-600 hover:text-orange-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {settings.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(settings._id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Delete
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
      </div>
    </div>
  );
};

export default AdminPaymentSettings; 