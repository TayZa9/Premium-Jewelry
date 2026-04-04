"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  images: string[];
  material?: string;
  gemstone?: string;
  category?: { name: string; slug: string };
}

interface WishlistContextType {
  items: WishlistProduct[];
  isLoading: boolean;
  addToWishlist: (product: WishlistProduct) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const LOCAL_KEY = 'aura-wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useAuth();

  // Load wishlist: from backend if authenticated, localStorage otherwise
  useEffect(() => {
    const load = async () => {
      if (user && token && !token.startsWith('mock-')) {
        try {
          const res = await fetch(`${API_URL}/api/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setItems(data.map((item: any) => item.product));
            setIsLoading(false);
            return;
          }
        } catch {
          // Fall through to localStorage
        }
      }
      // Fallback to localStorage
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch {
          localStorage.removeItem(LOCAL_KEY);
        }
      }
      setIsLoading(false);
    };
    load();
  }, [user, token]);

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addToWishlist = useCallback((product: WishlistProduct) => {
    setItems(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, product];
    });

    // Sync to backend if authenticated
    if (token && !token.startsWith('mock-')) {
      fetch(`${API_URL}/api/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id }),
      }).catch(() => {});
    }
  }, [token]);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems(prev => prev.filter(p => p.id !== productId));

    // Sync to backend if authenticated
    if (token && !token.startsWith('mock-')) {
      fetch(`${API_URL}/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  }, [token]);

  const isInWishlist = useCallback(
    (productId: string) => items.some(p => p.id === productId),
    [items]
  );

  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{ items, isLoading, addToWishlist, removeFromWishlist, isInWishlist, totalItems }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
