"use client";

import React, { useState, useEffect, MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlusIcon, HeartIcon } from "@heroicons/react/24/outline";
import type { Product } from "@/lib/types";   // ✅ FIXED TYPE IMPORT
import { addToWishlist } from "@/lib/api";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  priority = false,
}) => {
  const { article_id, name, price, category, score, image_url } = product;

  const [imgSrc, setImgSrc] = useState(image_url);

  useEffect(() => {
    setImgSrc(image_url);
  }, [image_url]);

  const handleWishlist = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToWishlist("123", article_id);
      toast.success("Added to wishlist!");
    } catch (err) {
      toast.error("Could not add to wishlist");
      console.error(err);
    }
  };

  return (
    <Link href={`/product/${article_id}`} className="block group">
      <div className="relative bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-gray-100">

        {/* ❤️ Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-md hover:text-red-600 transition-colors"
        >
          <HeartIcon className="h-5 w-5" />
        </button>

        {/* 📷 Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={imgSrc}
            alt={name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
            onError={() =>
              setImgSrc(
                "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop"
              )
            }
          />

          {/* 🏷 Top Match */}
          {score && score > 0.9 && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-md z-10 tracking-wider uppercase">
              Top Match
            </span>
          )}

          {/* ➕ Quick Add */}
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
            {category}
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
