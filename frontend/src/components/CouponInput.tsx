import React, { useState } from 'react';
import { Tag, X, Check, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CouponInputProps {
  orderAmount: number;
  cartItems: any[];
  onCouponApplied: (coupon: any, discountAmount: number) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: any;
  disabled?: boolean;
}

const CouponInput: React.FC<CouponInputProps> = ({
  orderAmount,
  cartItems,
  onCouponApplied,
  onCouponRemoved,
  appliedCoupon,
  disabled = false
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsValidating(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;
      const response = await axios.post(`${API_BASE_URL}/api/coupons/validate`, {
        code: couponCode.toUpperCase(),
        orderAmount,
        userId: user._id,
        cartItems: cartItems.map(item => ({
          category: item.category,
          price: item.price,
          quantity: item.quantity
        }))
      });

      if (response.data.valid) {
        onCouponApplied(response.data.coupon, response.data.discountAmount);
        setCouponCode('');
        toast.success(`Coupon applied! You saved ₹${response.data.discountAmount}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Invalid coupon code');
    } finally {
      setIsValidating(false);
    }
  };

  const removeCoupon = () => {
    onCouponRemoved();
    toast.success('Coupon removed');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateCoupon();
    }
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">
                Coupon Applied: {appliedCoupon.code}
              </p>
              <p className="text-sm text-green-600">
                {appliedCoupon.description}
              </p>
            </div>
          </div>
          <button
            onClick={removeCoupon}
            disabled={disabled}
            className="text-green-600 hover:text-green-800 disabled:opacity-50"
            title="Remove coupon"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Tag className="w-5 h-5 text-gray-600" />
        <h3 className="font-medium text-gray-900">Have a coupon code?</h3>
      </div>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          placeholder="Enter coupon code"
          disabled={disabled || isValidating}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={validateCoupon}
          disabled={disabled || isValidating || !couponCode.trim()}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isValidating ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Applying...</span>
            </>
          ) : (
            <span>Apply</span>
          )}
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Enter your coupon code to get instant discount on your order
      </p>
    </div>
  );
};

export default CouponInput;
