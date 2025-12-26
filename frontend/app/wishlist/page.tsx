"use client";

import { useEffect, useState } from "react";
import { getWishlist, type Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    // CHANGE 1: Ab hum Email uthayenge, ID nahi
    const userEmail = localStorage.getItem("user_email"); 

    // CHANGE 2: Security Check
    if (!userEmail) {
      console.log("No email found, redirecting to login");
      router.push("/login");
      return;
    }

    try {
      // CHANGE 3: API ko Email bhejo
      const data = await getWishlist(userEmail); 
      
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Failed to load wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold text-gray-500 animate-pulse">Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-black mb-8 tracking-tight">My Wishlist ({items.length})</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-gray-500 mb-4 text-lg">Your wishlist is empty.</p>
          <Link href="/products"> {/* Fixed Link to generic products page */}
            <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product, index) => (
            <ProductCard 
              key={product.article_id ? `${product.article_id}-${index}` : index} 
              product={product} 
            />
          ))}
        </div>
      )}
    </div>
  );
}