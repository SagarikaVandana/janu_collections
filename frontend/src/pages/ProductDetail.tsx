import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Truck, Shield, RefreshCw, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import WhatsAppContact from '../components/WhatsAppContact';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      if (response.data.sizes?.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
    
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = () => {
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

  const features = [
    { icon: Truck, text: 'Free shipping above ₹999' },
    { icon: RefreshCw, text: '7-day easy returns' },
    { icon: Shield, text: 'Secure payment' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square overflow-hidden rounded-lg bg-gray-100"
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600 capitalize">{product.category}</p>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.rating} stars)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg font-medium ${
                      selectedSize === size
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                -
              </button>
              <span className="px-4 py-2 border border-gray-300 rounded-md min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleWishlistToggle}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Heart
                className={`h-5 w-5 ${isInWishlist(product._id) ? 'text-red-500' : 'text-gray-600'}`}
              />
            </button>
          </div>

          {/* WhatsApp Contact */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-gray-600 text-sm">Have questions about this product?</p>
              </div>
              <a
                href={`https://wa.me/919391235258?text=Hi%20Janu%20Collections!%20I%20have%20a%20question%20about%20${encodeURIComponent(product.name)}%20(₹${product.price}).%20Can%20you%20help%20me?`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="border-t pt-6">
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="h-5 w-5 text-primary-500" />
                  <span className="text-gray-600">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;