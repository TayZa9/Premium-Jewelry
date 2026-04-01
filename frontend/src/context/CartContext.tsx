"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // product ID
  sku: string;
  name: string;
  price: string | number; // numeric or string that can be parsed
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  totalItems: number;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('aura-cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('aura-cart', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = (newItem: CartItem) => {
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.sku === newItem.sku);
      if (existing) {
        return currentItems.map((item) =>
          item.sku === newItem.sku ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...currentItems, newItem];
    });
    setIsCartOpen(true); // Auto open cart
  };

  const removeItem = (sku: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.sku !== sku));
  };

  const updateQuantity = (sku: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(sku);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) => (item.sku === sku ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  // Calculate total: need to ensure price is a number
  const cartTotal = items.reduce((total, item) => {
    const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace(/[$,]/g, '')) : item.price;
    return total + priceNum * item.quantity;
  }, 0);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart, isCartOpen, setIsCartOpen, cartTotal, totalItems, isHydrated
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
