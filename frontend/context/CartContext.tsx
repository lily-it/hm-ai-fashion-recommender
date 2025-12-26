"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '@/lib/api';
import toast from 'react-hot-toast';
// 1. Import fetchBagDB
import { trackUserInteraction, fetchBagDB } from '@/lib/api'; 

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

  // ---------------------------------------
  // ✅ NEW: RESTORE BAG ON LOAD
  // ---------------------------------------
  useEffect(() => {
    const restoreBag = async () => {
      const userEmail = localStorage.getItem("user_email");
      
      if (userEmail) {
        try {
          // Fetch saved items from Supabase
          const dbItems = await fetchBagDB(userEmail);
          
          if (dbItems && dbItems.length > 0) {
            // Convert DB format to CartItem format
            // DB returns products with 'selected_size'. We need to aggregate duplicates.
            const restoredItems: CartItem[] = [];

            dbItems.forEach((dbItem: any) => {
              // Check if item already exists in our temporary list
              const existing = restoredItems.find(
                i => i.article_id === dbItem.article_id && i.size === dbItem.selected_size
              );

              if (existing) {
                existing.quantity += 1;
              } else {
                restoredItems.push({
                  ...dbItem,
                  size: dbItem.selected_size, // Map 'selected_size' from DB to 'size'
                  quantity: 1
                });
              }
            });

            setItems(restoredItems);
            console.log("🎒 Bag Restored from DB:", restoredItems.length, "items");
          }
        } catch (error) {
          console.error("Failed to restore bag:", error);
        }
      }
    };

    restoreBag();
  }, []); // Run once on mount

  // ---------------------------------------
  // EXISTING ADD ITEM LOGIC
  // ---------------------------------------
  const addItem = (product: Product, size: string) => {
    // 1. Update Cart State (UI)
    setItems((prev) => {
      const existing = prev.find(i => i.article_id === product.article_id && i.size === size);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
    
    // 2. Open Cart & Show Toast
    setIsCartOpen(true); 
    toast.success(`Added ${product.name} to bag`);

    // 3. Track Interaction
    const userId = localStorage.getItem("user_id");
    if (userId) {
      trackUserInteraction(userId, product.article_id, 'add_to_cart');
    }
    
    // Note: The actual DB save (addToBagDB) is handled in page.tsx 
    // as per your previous setup, which is fine!
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