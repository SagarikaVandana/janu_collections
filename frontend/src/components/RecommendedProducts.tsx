import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import axios from 'axios';
import { useWishlist } from '../context/WishlistContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  rating?: number;
  reviews?: number;
}

interface RecommendedProductsProps {
  currentProductId?: string;
  category?: string;
  title?: string;
  limit?: number;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  currentProductId,
  category,
  title = "Recommended for You",
  limit = 4
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = '/api/products?sort=newest';
        
        // If we have a category, filter by it
        if (category) {
          url += `&category=${encodeURIComponent(category)}`;
        }
        
        const response = await axios.get(url);
        let recommendedProducts = response.data.products || [];
        
        // Filter out current product if provided
        if (currentProductId) {
          recommendedProducts = recommendedProducts.filter(
            (product: Product) => product._id !== currentProductId
          );
        }
        
        // Shuffle and limit products for variety
        const shuffled = recommendedProducts.sort(() => 0.5 - Math.random());
        const limitedProducts = shuffled.slice(0, limit);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setProducts(limitedProducts);
        }
      } catch (error) {
        console.error('Error fetching recommended products:', error);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [currentProductId, category, limit]);


  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
        category: product.category,
        sizes: []
      });
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Wishlist Button */}
            <button
              onClick={() => handleWishlistToggle(product)}
              className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`h-4 w-4 ${
                  isInWishlist(product._id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400 hover:text-red-500'
                }`}
              />
            </button>

            {/* Product Image */}
            <Link to={`/product/${product._id}`} className="block">
              <div className="aspect-square overflow-hidden rounded-t-lg">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>

            {/* Product Info */}
            <div className="p-3 sm:p-4">
              <Link to={`/product/${product._id}`} className="block">
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating!)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {product.reviews && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.reviews})
                    </span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-lg font-bold text-gray-900">
                  ₹{product.price}
                </span>
                <Link
                  to={`/product/${product._id}`}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium hidden sm:block"
                >
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
