import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: React.ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product: WishlistItem) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        toast.error('Product is already in your wishlist!');
        return prev;
      }
      toast.success('Added to wishlist!');
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => {
      const updated = prev.filter(item => item._id !== productId);
      toast.success('Removed from wishlist!');
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast.success('Wishlist cleared!');
  };

  const wishlistCount = wishlistItems.length;

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}; 