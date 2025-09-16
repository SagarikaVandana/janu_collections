import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const Wishlist: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();

  const handleAddToCart = (product: any) => {
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size';
    addToCart(product, size);
    toast.success('Added to cart!');
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleClearWishlist = () => {
    if (wishlistItems.length > 0) {
      clearWishlist();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your wishlist.</p>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Start adding products to your wishlist!</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card group relative"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-2 bg-primary-500 text-white rounded-full shadow-md hover:bg-primary-600 transition-colors"
                    title="Add to cart"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-2 sm:p-3 md:p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-2 capitalize">{product.category}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-sm sm:text-lg font-bold text-gray-900">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs sm:text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-xs sm:text-sm"
                  >
                    <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                  
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="px-2 sm:px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist; 