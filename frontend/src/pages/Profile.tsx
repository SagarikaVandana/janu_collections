import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    memberSince: 'Unknown',
  });
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: (user as any)?.phone || '',
    address: (user as any)?.address?.street || '',
    city: (user as any)?.address?.city || '',
    state: (user as any)?.address?.state || '',
    pincode: (user as any)?.address?.pincode || '',
    country: (user as any)?.address?.country || 'India',
  });

  useEffect(() => {
    fetchUserStats();
    fetchUserProfile();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/api/auth/stats');
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address?.street || '',
        city: userData.address?.city || '',
        state: userData.address?.state || '',
        pincode: userData.address?.pincode || '',
        country: userData.address?.country || 'India',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/auth/profile', {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        address: {
          street: profileData.address,
          city: profileData.city,
          state: profileData.state,
          pincode: profileData.pincode,
          country: profileData.country,
        },
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      alert('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh user profile data
      await fetchUserProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Error updating profile');
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'orders':
        navigate('/orders');
        break;
      case 'addresses':
        setShowAddressModal(true);
        break;
      case 'password':
        setShowPasswordModal(true);
        break;
      default:
        break;
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
    } catch (error: any) {
      console.error('Error changing password:', error);
      alert(error.response?.data?.message || 'Error changing password');
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Address management logic will be implemented here
    alert('Address management functionality will be implemented');
    setShowAddressModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-primary flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="Enter address"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Enter city"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={profileData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Enter state"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={profileData.pincode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Enter pincode"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={profileData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Enter country"
                />
              </div>
            </div>
            
            {isEditing && (
              <div className="mt-6 flex space-x-4">
                <button onClick={handleSave} className="btn-primary">
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleQuickAction('orders')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Order History
              </button>
              <button 
                onClick={() => handleQuickAction('orders')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Track Orders
              </button>
              <button 
                onClick={() => handleQuickAction('addresses')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Manage Addresses
              </button>
              <button 
                onClick={() => handleQuickAction('password')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
            {loading ? (
              <div className="space-y-3">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold">{userStats.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-semibold">₹{userStats.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">{userStats.memberSince}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Management Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Manage Addresses</h3>
            <form onSubmit={handleAddressSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="address-name"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label htmlFor="address-text" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    id="address-text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter complete address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="address-city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      id="address-city"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label htmlFor="address-pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      id="address-pincode"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Pincode"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="address-phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="address-phone"
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;