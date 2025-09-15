import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, size: string, selectedImageIndex?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export { CartContext };

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: any, size: string, selectedImageIndex: number = 0) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item._id === product._id && item.size === size);
      
      if (existingItem) {
        // Check if increasing quantity would exceed limit
        const newQuantity = existingItem.quantity + 1;
        const totalItems = prev.reduce((total, item) => total + item.quantity, 0);
        
        if (totalItems >= 5) {
          toast.error('Maximum 5 items allowed in cart. Complete your purchase to add more items.');
          return prev;
        }
        
        return prev.map(item =>
          item._id === product._id && item.size === size
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      // Check if adding new item would exceed limit
      const totalItems = prev.reduce((total, item) => total + item.quantity, 0);
      if (totalItems >= 5) {
        toast.error('Maximum 5 items allowed in cart. Complete your purchase to add more items.');
        return prev;
      }
      
      return [...prev, {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[selectedImageIndex] || product.images[0],
        size,
        quantity: 1,
      }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCartItems(prev => prev.filter(item => !(item._id === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    
    setCartItems(prev => {
      // Calculate total items if this update goes through
      const totalItems = prev.reduce((total, item) => {
        if (item._id === productId && item.size === size) {
          return total + quantity;
        }
        return total + item.quantity;
      }, 0);
      
      if (totalItems > 5) {
        toast.error('Maximum 5 items allowed in cart. Complete your purchase to add more items.');
        return prev;
      }
      
      return prev.map(item =>
        item._id === productId && item.size === size
          ? { ...item, quantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems: getTotalItems(),
    totalAmount: getTotalPrice(),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};