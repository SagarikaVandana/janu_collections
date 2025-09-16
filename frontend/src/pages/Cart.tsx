import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import RecommendedProducts from '../components/RecommendedProducts';
import CouponInput from '../components/CouponInput';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, totalAmount, totalItems } = useCart();
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleCouponApplied = (coupon: any, discount: number) => {
    setAppliedCoupon(coupon);
    setDiscountAmount(discount);
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const finalAmount = Math.max(0, totalAmount - discountAmount);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Discover our amazing products and add them to your cart</p>
        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex items-center mb-6 sm:mb-8">
        <Link to="/products" className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        {cartItems.map((item, index) => (
          <motion.div
            key={`${item._id}-${item.size}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              {/* Product Image */}
              <Link to={`/product/${item._id}`} className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item._id}`} className="block hover:text-primary-600 transition-colors">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 cursor-pointer line-clamp-2">{item.name}</h3>
                </Link>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Size: {item.size}</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">₹{item.price}</p>
              </div>

              {/* Mobile: Quantity and Remove in separate row */}
              <div className="sm:hidden w-full flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                    className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    title="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-2 py-1 border border-gray-300 rounded-md min-w-[2rem] text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                    className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    title="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-gray-900 mb-2">
                    ₹{item.price * item.quantity}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id, item.size)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Desktop: Quantity Controls */}
              <div className="hidden sm:flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                  className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                  title="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-3 py-1 border border-gray-300 rounded-md min-w-[2.5rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                  className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                  title="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Desktop: Item Total */}
              <div className="hidden sm:block text-right">
                <p className="text-lg font-bold text-gray-900">
                  ₹{item.price * item.quantity}
                </p>
                <button
                  onClick={() => removeFromCart(item._id, item.size)}
                  className="text-red-500 hover:text-red-700 mt-2"
                  title="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coupon Section */}
      <div className="mt-8">
        <CouponInput
          orderAmount={totalAmount}
          cartItems={cartItems}
          onCouponApplied={handleCouponApplied}
          onCouponRemoved={handleCouponRemoved}
          appliedCoupon={appliedCoupon}
        />
      </div>

      {/* Cart Summary */}
      <div className="mt-8 card p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-600">Items ({totalItems})</span>
            <span className="text-lg font-semibold">₹{totalAmount}</span>
          </div>
          
          {appliedCoupon && (
            <div className="flex justify-between items-center text-green-600">
              <span className="text-lg">Coupon Discount ({appliedCoupon.code})</span>
              <span className="text-lg font-semibold">-₹{discountAmount}</span>
            </div>
          )}
          
          {totalItems >= 5 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <strong>Cart Limit Reached:</strong> Maximum 5 items allowed. Remove items to proceed to checkout.
              </p>
            </div>
          )}
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{finalAmount}
              </span>
            </div>
            {appliedCoupon && (
              <p className="text-sm text-green-600 mt-1">
                You saved ₹{discountAmount} with coupon {appliedCoupon.code}!
              </p>
            )}
          </div>
          
          <div className="pt-4">
            {totalItems >= 5 ? (
              <button
                disabled
                className="w-full bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed opacity-60"
                title="Remove items to proceed to checkout"
              >
                Checkout Disabled - Remove Items
              </button>
            ) : (
              <Link
                to="/checkout"
                className="w-full btn-primary block text-center py-3"
              >
                Proceed to Checkout
              </Link>
            )}
          </div>
          
          <div className="text-center">
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="mt-12 border-t pt-8">
        <RecommendedProducts 
          title="You might also like"
          limit={4}
        />
      </div>
    </div>
  );
};

export default Cart;