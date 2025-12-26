"use client";

import React, { useState, useEffect, MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { PlusIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"; 
import type { Product } from "@/lib/api"; 
import { addToWishlist, trackUserInteraction } from "@/lib/api";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  priority = false,
}) => {
  const router = useRouter();
  
  // 1. We need BOTH Email (for Wishlist) and ID (for Tracking)
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 2. Get Logged In User Data on Mount
  useEffect(() => {
    // Retrieve Email AND ID from LocalStorage
    const storedEmail = localStorage.getItem("user_email");
    const storedId = localStorage.getItem("user_id");
    
    setUserEmail(storedEmail);
    setUserId(storedId);
  }, []);

  // 🛡️ SAFETY CHECK 1: If product data is null, don't render
  if (!product) return null;

  const { 
    article_id, 
    name = "Unknown Product", 
    price, 
    category, 
    score, 
    image_url 
  } = product;

  // 🛡️ SAFETY CHECK 2: Placeholder Image Logic
  const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop";
  const initialImage = (image_url && image_url.trim() !== "") ? image_url : PLACEHOLDER_IMAGE;
  const [imgSrc, setImgSrc] = useState(initialImage);

  useEffect(() => {
    setImgSrc((image_url && image_url.trim() !== "") ? image_url : PLACEHOLDER_IMAGE);
  }, [image_url]);

  // ---------------------------------------------------------
  // 🔒 SECURE WISHLIST HANDLER (FIXED 🛠️)
  // ---------------------------------------------------------
  const handleWishlist = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    e.stopPropagation();

    // 1. Check if User Email exists (Primary check for Wishlist)
    if (!userEmail) {
      toast.error("Please login to save items!");
      router.push("/login"); 
      return;
    }

    setLoading(true);

    // 2. Add to Backend
    try {
      // ✅ FIX: Sending userEmail instead of userId
      await addToWishlist(userEmail, article_id); 
      
      setIsWishlisted(true);
      toast.success("Added to wishlist!");
      
      // Optional: Track that they liked this (Tracking still uses User ID)
      if (userId) {
        trackUserInteraction(userId, article_id, 'view');
      }
    } catch (err) {
      toast.error("Could not add to wishlist");
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Link href={`/product/${article_id}`} className="block group">
      <div className="relative bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-gray-100">

        {/* ❤️ Wishlist Button */}
        <button
          onClick={handleWishlist}
          disabled={loading}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full shadow-md transition-colors ${
            isWishlisted 
              ? "bg-red-50 text-red-600 hover:bg-red-100" 
              : "bg-white/90 hover:bg-white hover:text-red-600 text-gray-400"
          }`}
        >
          {isWishlisted ? <HeartIconSolid className="h-5 w-5" /> : <HeartIcon className="h-5 w-5" />}
        </button>

        {/* 📷 Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={imgSrc}
            alt={name || "Product Image"}
            fill
            priority={priority}
            loading={priority ? "eager" : "lazy"} // Naya logic
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
            onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
          />

          {/* 🏷 Top Match Badge */}
          {score && score > 0.9 && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-md z-10 tracking-wider uppercase">
              Top Match
            </span>
          )}

          {/* ➕ Quick Add (Visual Only for now) */}
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <button className="w-full bg-black/90 backdrop-blur-md text-white py-3 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black">
              <PlusIcon className="h-4 w-4" />
              Quick Add
            </button>
          </div>
        </div>

        {/* ℹ️ Product Info */}
        <div className="p-4">
          <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">
            {category || "Fashion"}
          </p>
          <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
            {name}
          </h3>
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">₹{price}</span>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;