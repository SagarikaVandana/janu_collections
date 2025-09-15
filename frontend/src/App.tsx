import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppContact from './components/WhatsAppContact';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import Payment from './pages/Payment';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPaymentSettings from './pages/admin/AdminPaymentSettings';
import AdminLogin from './pages/admin/AdminLogin';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminReports from './pages/admin/AdminReports';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCoupons from './pages/admin/AdminCoupons';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />
          
          {/* Protected Routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/order-success" element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } />
          <Route path="/payment/:orderId" element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } />
          <Route path="/admin/payment-settings" element={
            <AdminRoute>
              <AdminPaymentSettings />
            </AdminRoute>
          } />
          <Route path="/admin/newsletter" element={
            <AdminRoute>
              <AdminNewsletter />
            </AdminRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminRoute>
              <AdminAnalytics />
            </AdminRoute>
          } />
          <Route path="/admin/reports" element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path="/admin/coupons" element={
            <AdminRoute>
              <AdminCoupons />
            </AdminRoute>
          } />
        </Routes>
      </main>
      <Footer />
      <WhatsAppContact />
    </div>
  );
}

export default App;