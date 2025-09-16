import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, RefreshCw, MessageCircle, Phone, Mail, MapPin, CheckCircle, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import WhatsAppContact from '../components/WhatsAppContact';
import Logo from '../components/Logo';
import axios from 'axios';
import toast from 'react-hot-toast';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      console.log('Fetching featured products for home page...');
      const response = await axios.get('/api/products?limit=12&sort=newest');
      console.log('Home products response:', response.data);
      
      // Handle different response structures
      const productsData = response.data.products || response.data || [];
      setFeaturedProducts(productsData);
      setError('');
      console.log('Featured products set:', productsData.length);
    } catch (error: any) {
      console.error('Error fetching featured products:', error);
      setError(error.response?.data?.message || 'Error fetching products');
    }
    setLoading(false);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setNewsletterLoading(true);
    
    try {
      const response = await axios.post('/api/newsletter/subscribe', {
        email: newsletterEmail.trim()
      });

      toast.success(response.data.message);
      setNewsletterEmail('');
      setNewsletterSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setNewsletterSuccess(false);
      }, 3000);
      
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      toast.error(error.response?.data?.message || 'Failed to subscribe to newsletter');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const categories = [
    {
      name: 'Sarees',
      image: 'https://images.pexels.com/photos/8839772/pexels-photo-8839772.jpeg',
      description: 'Elegant traditional sarees',
    },
    {
      name: 'Kurtis',
      image: 'https://images.pexels.com/photos/8839774/pexels-photo-8839774.jpeg',
      description: 'Comfortable daily wear',
    },
    {
      name: 'Western',
      image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',
      description: 'Trendy western outfits',
    },
    {
      name: 'Ethnic',
      image: 'https://images.pexels.com/photos/8839775/pexels-photo-8839775.jpeg',
      description: 'Traditional ethnic wear',
    },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free delivery on orders above ₹8000',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment processing',
    },
  ];

  console.log('Home component state:', { loading, featuredProducts: featuredProducts.length, error });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
          <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left px-4 sm:px-0"
            >
              {/* Logo */}
              <div className="flex justify-center lg:justify-start mb-4 lg:mb-6">
                <Logo size="lg" showText={false} />
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
                  Janu Collection
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 lg:mb-8 max-w-lg mx-auto lg:mx-0">
                Discover the latest trends in ethnic and western wear. Quality fashion for every occasion.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
            <Link
              to="/products"
                  className="btn-primary flex items-center justify-center space-x-2"
            >
              <span>Shop Now</span>
                  <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
                  to="/contact"
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <span>Contact Us</span>
                  <MessageCircle className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 rounded-2xl p-6 sm:p-8 shadow-xl mx-4 sm:mx-0">
                <div className="text-center">
                  <div className="mb-4 lg:mb-6">
                    <Logo size="lg" showText={false} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">JANU COLLECTION</h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">Premium Fashion for Every Woman</p>
                  <div className="flex justify-center space-x-3 sm:space-x-4">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">500+</div>
                      <div className="text-xs sm:text-sm text-gray-600">Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-pink-600">1000+</div>
                      <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-yellow-600">50+</div>
                      <div className="text-xs sm:text-sm text-gray-600">Cities</div>
                    </div>
                  </div>
                </div>
              </div>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Janu Collection?
            </h2>
            <p className="text-xl text-gray-600">
              We provide the best shopping experience with quality products and excellent service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <motion.div
              initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              className="text-center p-4 lg:p-6"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Truck className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-sm lg:text-base text-gray-600">Free shipping on orders above ₹8000</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-4 lg:p-6"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
                  </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-sm lg:text-base text-gray-600">Premium quality products with 100% satisfaction</p>
              </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center p-4 lg:p-6 sm:col-span-2 lg:col-span-1"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Headphones className="h-6 w-6 lg:h-8 lg:w-8 text-pink-600" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Customer Support</h3>
              <div className="text-sm lg:text-base text-gray-600">
                <p className="mb-1">24/7 live chat and WhatsApp support</p>
                <p>Dedicated helpline for order-related queries</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most popular and trending products
            </p>
          </div>

          {error ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Products</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchFeaturedProducts}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-600 mb-4">Check back soon for our latest collection!</p>
            </div>
          )}

          {featuredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>View All Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Subscribe to our newsletter for the latest trends and exclusive offers
          </p>
          
          {newsletterSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center space-x-2 text-white"
            >
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">Thank you for subscribing!</span>
            </motion.div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={newsletterLoading}
                className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={newsletterLoading || !newsletterEmail.trim()}
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {newsletterLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>
          )}
          
          <p className="text-sm text-white opacity-75 mt-4">
            Get notified about new collections, exclusive discounts, and fashion tips
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                <Phone className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600 text-sm sm:text-base">+91 9391235258</p>
            </div>
            
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                <Mail className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm sm:text-base break-all">janucollectionvizag@gmail.com</p>
            </div>
            
            <div className="text-center p-4 sm:col-span-2 lg:col-span-1">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                <MapPin className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600 text-sm sm:text-base">MADHURAWADA, VISAKHAPATNAM, ANDHRA PRADESH, PIN 530041</p>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppContact variant="floating" />
    </div>
  );
};

export default Home;