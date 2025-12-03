"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '@/lib/api';
import toast from 'react-hot-toast';

interface CartItem extends Product {
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string) => void;
  removeItem: (articleId: string, size: string) => void;
  toggleCart: () => void;
  isCartOpen: boolean;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = (product: Product, size: string) => {
    setItems((prev) => {
      const existing = prev.find(i => i.article_id === product.article_id && i.size === size);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
    setIsCartOpen(true); // Auto-open cart
    toast.success(`Added ${product.name} to bag`);
  };

  const removeItem = (articleId: string, size: string) => {
    setItems((prev) => prev.filter(i => !(i.article_id === articleId && i.size === size)));
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, toggleCart, isCartOpen, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};