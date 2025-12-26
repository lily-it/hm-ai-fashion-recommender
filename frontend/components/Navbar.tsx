"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  ShoppingBagIcon, 
  UserIcon, 
  HeartIcon,
  ArrowRightOnRectangleIcon,
  CameraIcon // 👈 1. Added Camera Icon
} from "@heroicons/react/24/outline";
import { useCart } from '@/context/CartContext';
import { logoutUser } from '@/lib/api';
import ImageSearchModal from './ImageSearchModal'; // 👈 2. Import the Modal Component

const Navbar: React.FC = () => {
  const { cartCount, toggleCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 👈 3. State for Image Search Modal
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  // 1. Check Login Status on Load & Route Change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  // 2. Handle Logout
  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  // 👈 Increased padding-right (pr-12) to make space for Camera Icon
                  className="w-full bg-gray-100 text-gray-900 rounded-full py-2 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5 group-focus-within:text-red-500 transition-colors" />
                
                {/* 📸 4. CAMERA BUTTON ADDED HERE */}
                <button
                  type="button" // Important: prevents form submission
                  onClick={() => setIsImageSearchOpen(true)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-black transition-colors"
                  title="Search by Image"
                >
                  <CameraIcon className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* SOCIAL LINKS + ICONS */}
            <div className="flex items-center space-x-6 text-gray-600">

              {/* Social Links (Hidden on small screens) */}
              <div className="hidden lg:flex items-center space-x-4">
                <a
                  href="https://github.com/showlittlemercy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
                >
                  GitHub
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="https://www.linkedin.com/in/priyanshu-thakur-a47774360/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
                >
                  LinkedIn
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="https://www.instagram.com/showlittlemercy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
                >
                  Instagram
                </a>
              </div>

              {/* Wishlist */}
              <Link href="/wishlist">
                <button className="hover:text-red-600 transition-colors flex items-center">
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

              {/* PROFILE / LOGOUT LOGIC */}
              {isLoggedIn ? (
                 <button 
                   onClick={handleLogout} 
                   className="hover:text-red-600 transition-colors flex items-center gap-1 group"
                   title="Logout"
                 >
                   <span className="text-sm font-bold text-gray-700 group-hover:text-red-600 hidden md:block">Logout</span>
                   <ArrowRightOnRectangleIcon className="h-6 w-6" />
                 </button>
              ) : (
                 <Link href="/login">
                   <button className="hover:text-red-600 transition-colors mt-1" title="Login">
                     <UserIcon className="h-6 w-6" />
                   </button>
                 </Link>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* 📸 5. MOUNT IMAGE SEARCH MODAL */}
      <ImageSearchModal 
        isOpen={isImageSearchOpen} 
        onClose={() => setIsImageSearchOpen(false)} 
      />
    </>
  );
};

export default Navbar;