import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', { email });
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
        toast.error('Unable to connect to server. Please check if the backend is running.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(`Login failed: ${error.message}`);
      } else {
        toast.error('Login failed. Please try again.');
      }
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting registration with:', { name, email });
      const response = await axios.post('/api/auth/register', { name, email, password });
      console.log('Registration response:', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      toast.success('Registration successful!');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
        toast.error('Unable to connect to server. Please check if the backend is running.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(`Registration failed: ${error.message}`);
      } else {
        toast.error('Registration failed. Please try again.');
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};