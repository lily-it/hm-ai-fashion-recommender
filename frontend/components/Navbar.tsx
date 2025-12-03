"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  ShoppingBagIcon, 
  UserIcon, 
  HeartIcon 
} from "@heroicons/react/24/outline";
import { useCart } from '@/context/CartContext';

const Navbar: React.FC = () => {
  const { cartCount, toggleCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <span className="text-2xl font-black text-red-600 tracking-tighter group-hover:scale-105 transition-transform">
              H&M
            </span>
            <span className="hidden sm:block text-sm font-medium text-gray-500 tracking-widest uppercase">
              Recommender
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for styles, brands..."
                className="w-full bg-gray-100 text-gray-900 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5 group-focus-within:text-red-500 transition-colors" />
            </form>
          </div>

          {/* SOCIAL LINKS + ICONS */}
          <div className="flex items-center space-x-6 text-gray-600">

            {/* Social Links */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="https://github.com/lily-it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
              >
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/dixika-thakur-928b20369/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
              >
                LinkedIn
              </a>

              {/* Your Name Badge */}
              <span className="text-xs font-semibold text-gray-500 border px-2 py-1 rounded-full hidden lg:block">
                Built by Dixika Thakur
              </span>
            </div>

            {/* Wishlist */}
            <Link href="/wishlist">
              <button className="hover:text-red-600 transition-colors">
                <HeartIcon className="h-6 w-6" />
              </button>
            </Link>

            {/* Cart Icon */}
            <button 
              onClick={toggleCart}
              className="hover:text-red-600 transition-colors relative"
            >
              <ShoppingBagIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <Link href="/profile">
              <button className="hover:text-red-600 transition-colors mt-1">
                <UserIcon className="h-6 w-6" />
              </button>
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
