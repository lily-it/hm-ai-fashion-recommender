"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
  const { isCartOpen, toggleCart, items, removeItem, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold tracking-tight">Shopping Bag ({items.length})</h2>
              <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <p>Your bag is empty.</p>
                  <button onClick={toggleCart} className="text-black underline font-bold">Start Shopping</button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.article_id}-${item.size}`} className="flex gap-4">
                    <div className="w-24 h-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.image_url || ''} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                          <button onClick={() => removeItem(item.article_id, item.size)} className="text-gray-400 hover:text-red-500">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                        <p className="text-sm text-gray-500">Size: <span className="font-medium text-black">{item.size}</span></p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        <span className="font-bold text-lg">${(item.price / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between mb-4 text-lg font-bold">
                  <span>Total</span>
                  <span>${(cartTotal / 100).toFixed(2)}</span>
                </div>
                <button className="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg">
                  Checkout
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">Shipping & taxes calculated at checkout.</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;