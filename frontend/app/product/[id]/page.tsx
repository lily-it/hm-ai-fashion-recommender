"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  fetchProductById,
  fetchSplitRecommendations, // 👈 Ensures we fetch the split data
  fetchTrending,             // 👈 Fallback if AI fails
  trackUserInteraction,
  addToWishlist,
  addToBagDB,
  type Product,
} from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { StarIcon, ShoppingBagIcon, FireIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

const fallbackImage =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop";

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  // --- States ---
  const [product, setProduct] = useState<Product | null>(null);
  
  // --- LAYOUT STATE: 2 Separate Lists ---
  const [visualMatches, setVisualMatches] = useState<Product[]>([]);
  const [popularMatches, setPopularMatches] = useState<Product[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Handle array vs string id
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
      if (!id) return;

      setLoading(true);
      try {
        // 1. Fetch Main Product Details
        const productData = await fetchProductById(id);
        setProduct(productData);

        // 2. Fetch Split Recommendations (Visual + Popular)
        try {
          const splitData = await fetchSplitRecommendations(id);
          
          if (splitData && (splitData.similar?.length > 0 || splitData.popular?.length > 0)) {
            // Success: Set both lists separately
            setVisualMatches(splitData.similar || []);
            setPopularMatches(splitData.popular || []);
          } else {
            throw new Error("Empty or Invalid Split Data");
          }

        } catch (apiError) {
          console.warn("⚠️ AI/Split API failed. Loading Trending Fallback.", apiError);
          
          // --- FALLBACK LOGIC ---
          // If AI fails, load general trending items into the Popular section
          try {
            const trendingData = await fetchTrending();
            setPopularMatches(trendingData.slice(0, 4)); // Show top 4 trending
            setVisualMatches([]); // Hide visual match section
          } catch (err) {
            console.error("Fallback also failed", err);
          }
        }

        // 3. Track View (User Interaction)
        const userId = localStorage.getItem("user_id");
        if (userId) {
          trackUserInteraction(userId, id, 'view');
        }

      } catch (error) {
        console.error("Failed to load product data", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  // --- ACTIONS ---
// ... (useEffect aur states ke baad)
const handleAddToCart = async () => {
    const userId = localStorage.getItem("user_id");
    const userEmail = localStorage.getItem("user_email"); // 👈 Email chahiye DB ke liye

    if (!userId) {
      toast.error("Please login to shop!");
      router.push("/login");
      return;
    }

    if (!product) return;
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }

    // 1. Add to Local Context (Immediate UI Update)
    addItem(product, selectedSize);

    // 2. Add to Database (Permanent Save)
    if (userEmail) {
       // Background mein save karo taaki UI slow na ho
       addToBagDB(userEmail, product.article_id, selectedSize)
         .then(() => console.log("Saved to cloud ☁️"))
         .catch(err => console.error("Save failed", err));
    }

    toast.success("Added to Bag!");
  };

// ... (handleWishlist function ke upar)

  const handleWishlist = async () => {
    const userEmail = localStorage.getItem("user_email"); 
    if (!userEmail) {
      toast.error("Please login to save items!");
      router.push("/login");
      return;
    }
    if (!product) return;

    try {
      await addToWishlist(userEmail, product.article_id);
      setIsWishlisted(true);
      toast.success("Added to Wishlist");
    } catch (error) {
      console.error(error);
      toast.error("Could not add to wishlist");
    }
  };

  // --- RENDER LOADING / ERROR ---
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <a href="/" className="text-red-600 hover:underline">Return Home</a>
      </div>
    );

  const productImage = product.image_url || fallbackImage;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* --- SECTION 1: MAIN PRODUCT DETAILS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-24 border-b border-gray-100 pb-16">
        {/* Left: Image */}
        <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
          <Image
            src={productImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
          />
           {/* ML Match Score Badge */}
          {product.score && (
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-green-700 shadow-sm border border-green-100 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-green-500" />
              {(product.score * 100).toFixed(0)}% Match
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="flex flex-col justify-center">
          <div className="mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest border border-gray-200 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
            <span className="text-3xl font-medium text-gray-900">
              ${(product.price).toFixed(2)}
            </span>
            <div className="flex items-center gap-1 pl-6 border-l border-gray-200">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (<StarIcon key={s} className="h-5 w-5" />))}
              </div>
              <span className="text-sm text-gray-500 ml-2 font-medium underline cursor-pointer">42 reviews</span>
            </div>
          </div>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Elevate your style with this premium {product.category?.toLowerCase()}. 
            Designed for modern comfort and a perfect tailored fit.
          </p>

          {/* Size Selector */}
          <div className="mb-10">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Select Size</h3>
            <div className="flex gap-3 flex-wrap">
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 rounded-full border flex items-center justify-center font-medium transition-all duration-200
                    ${selectedSize === size
                      ? "border-black bg-black text-white scale-110 shadow-lg"
                      : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-red-600 text-white py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-transform active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-red-100"
            >
              <ShoppingBagIcon className="h-6 w-6" />
              Add to Bag
            </button>
            <button 
              onClick={handleWishlist}
              className={`w-16 h-16 border rounded-full flex items-center justify-center transition-colors active:scale-95 ${
                 isWishlisted ? "border-red-500 bg-red-50 text-red-600" : "border-gray-200 text-gray-400 hover:text-red-500"
              }`}
            >
              {isWishlisted ? <HeartIconSolid className="h-7 w-7" /> : <HeartIcon className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: VISUAL MATCHES (Similar Styles) --- */}
      {/* Renders first if data is available */}
      {visualMatches.length > 0 && (
        <div className="mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4 mb-8">
             <h2 className="text-3xl font-black text-gray-900 tracking-tight">Similar Styles</h2>
             <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
               <SparklesIcon className="w-3 h-3" /> Visual Match
             </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {visualMatches.map((item) => (
              <ProductCard key={item.article_id} product={item} />
            ))}
          </div>
        </div>
      )}

      {/* --- SECTION 3: POPULAR (Trending/ML) --- */}
      {/* Renders below Visual Matches */}
      {popularMatches.length > 0 && (
        <div className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-4 mb-8">
             <h2 className="text-3xl font-black text-gray-900 tracking-tight">Trending Now</h2>
             <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
               <FireIcon className="w-3 h-3" /> Popular
             </span>
          </div>
          <p className="text-gray-500 mb-6 -mt-6">Best-selling items recommended by our AI.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {popularMatches.map((item) => (
              <ProductCard key={item.article_id} product={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;