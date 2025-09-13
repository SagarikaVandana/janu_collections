import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  rating?: number;
  sizes?: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        category: product.category,
        sizes: product.sizes || [],
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size';
    addToCart(product, size);
    toast.success('Added to cart!');
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="card group relative"
    >
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </Link>
        
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            -{discount}%
          </div>
        )}
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full shadow-md transition-colors ${
              isInWishlist(product._id) 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            title={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleAddToCart}
            className="p-2 bg-primary-500 text-white rounded-full shadow-md hover:bg-primary-600 transition-colors"
            title="Add to cart"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/product/${product._id}`} className="block group">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2 capitalize">{product.category}</p>
        </Link>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          
          {product.rating && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600">★ {product.rating}</span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center space-x-2 bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;