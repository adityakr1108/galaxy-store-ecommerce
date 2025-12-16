import React, { createContext, useContext, useState, useEffect } from 'react';
import { database, CartItem, Product } from '@/lib/database';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const cartItems = database.getCart(user.id);
      setItems(cartItems);
    } else {
      setItems([]);
    }
  }, [user]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (!user) return;

    const existingItem = items.find(item => item.productId === product.id);
    let newItems: CartItem[];

    if (existingItem) {
      newItems = items.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newItems = [...items, { productId: product.id, quantity, product }];
    }

    setItems(newItems);
    database.setCart(user.id, newItems);
  };

  const removeFromCart = (productId: string) => {
    if (!user) return;

    const newItems = items.filter(item => item.productId !== productId);
    setItems(newItems);
    database.setCart(user.id, newItems);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newItems = items.map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    );

    setItems(newItems);
    database.setCart(user.id, newItems);
  };

  const clearCart = () => {
    if (!user) return;

    setItems([]);
    database.clearCart(user.id);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
