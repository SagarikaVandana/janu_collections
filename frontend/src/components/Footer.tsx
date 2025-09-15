import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, MessageCircle, Youtube } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <Logo size="md" showText={true} className="text-white" />
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Discover the latest trends in ethnic and western wear. Quality fashion for every occasion.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/janucollectionvizag/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                title="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/janucollectionvizag1" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer" title="Follow us on Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.youtube.com/@Janucollectionvizag"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Subscribe to our YouTube channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/products" className="block text-gray-300 hover:text-white transition-colors">
                Products
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
              <Link to="/login" className="block text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="block text-gray-300 hover:text-white transition-colors">
                Register
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <div className="space-y-2">
              <Link to="/orders" className="block text-gray-300 hover:text-white transition-colors">
                My Orders
              </Link>
              <Link to="/profile" className="block text-gray-300 hover:text-white transition-colors">
                My Profile
              </Link>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Shipping Info
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Returns & Exchanges
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Size Guide
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-500" />
                <span className="text-gray-300">+91 9391235258</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-500" />
                <span className="text-gray-300">janucollectionvizag@gmail.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary-500 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  MADHURAWADA, VISAKHAPATNAM, ANDHRA PRADESH, PIN 530041
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-primary-500" />
                <a 
                  href="https://wa.me/919391235258?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products%20at%20Janu%20Collection%21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 Janu Collection. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a 
                href="https://www.instagram.com/janucollectionvizag/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                title="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/janucollectionvizag1" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer" title="Follow us on Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.youtube.com/@Janucollectionvizag"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Subscribe to our YouTube channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;