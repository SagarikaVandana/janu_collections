import React from 'react';
import { MessageCircle, Phone, Mail, MapPin, Clock, Send, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import WhatsAppContact from '../components/WhatsAppContact';

const Contact: React.FC = () => {
  const contactInfo = {
    phone: '+91 9391235258',
    email: 'janucollectionvizag@gmail.com',
    address: 'MADHURAWADA, VISAKHAPATNAM, ANDHRA PRADESH, PIN 530041',
    whatsapp: 'https://wa.me/919391235258?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products%20at%20Janu%20Collection%21',
    instagram: 'https://www.instagram.com/janucollectionvizag/',
    hours: 'Monday - Saturday: 10:00 AM - 8:00 PM'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Have questions about our products or need assistance? We're here to help! 
          Reach out to us through any of the channels below.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              {/* WhatsApp */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">WhatsApp</h3>
                  <p className="text-gray-600 mb-2">Fastest way to get in touch</p>
                  <a
                    href={contactInfo.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Instagram className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Instagram</h3>
                  <p className="text-gray-600 mb-2">Follow us for latest updates</p>
                  <a
                    href={contactInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Follow on Instagram</span>
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                  <p className="text-gray-600 mb-2">Call us directly</p>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600 mb-2">Send us an email</p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Address</h3>
                  <p className="text-gray-600">
                    {contactInfo.address}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                  <p className="text-gray-600">
                    {contactInfo.hours}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-8 border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a subject</option>
                <option value="product-inquiry">Product Inquiry</option>
                <option value="order-status">Order Status</option>
                <option value="returns">Returns & Exchanges</option>
                <option value="sizing">Sizing Questions</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>
              
              <a
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Quick Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-8 text-white"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-xl opacity-90">
            Get instant help through WhatsApp - we typically respond within minutes!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <WhatsAppContact variant="inline" showAllContacts={true} />
        </div>
      </motion.div>
    </div>
  );
};

export default Contact; 