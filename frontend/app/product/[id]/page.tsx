"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  fetchProductById,
  fetchSimilarItems,
  trackView,
  type Product,
} from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { StarIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

const fallbackImage =
  "https://images.unsplash.com/photo-1515886657613-9f3515bc78f2?q=80&w=900&auto=format&fit=crop";

const ProductDetailPage = () => {
  const params = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarItems, setSimilarItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
      if (!id) return;

      setLoading(true);
      try {
        const [productData, similarData] = await Promise.all([
          fetchProductById(id),
          fetchSimilarItems(id),
        ]);

        setProduct(productData);
        setSimilarItems(similarData);

        // Track view safely
        trackView("123", id);
      } catch (error) {
        console.error("Failed to load product details", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }
    addItem(product, selectedSize);
  };

  // Loading Spinner
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );

  // No product found
  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <a href="/" className="text-red-600 hover:underline">
          Return Home
        </a>
      </div>
    );

  const productImage = product.image_url || fallbackImage;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Product Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* LEFT IMAGE */}
        <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <Image
            src={productImage}
            alt={product.name}
            fill
            priority
            loading="eager"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            onError={(e) => {
              console.warn("❌ Product image failed, using fallback.");
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />

          {product.score && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-green-700 shadow-sm border border-green-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {(product.score * 100).toFixed(0)}% AI Match
            </div>
          )}
        </div>

        {/* RIGHT SIDE DETAILS */}
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
              ${(product.price / 100).toFixed(2)}
            </span>

            <div className="flex items-center gap-1 pl-6 border-l border-gray-200">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} className="h-5 w-5" />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2 font-medium underline cursor-pointer hover:text-black">
                42 reviews
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Elevate your style with this premium {product.category.toLowerCase()}
            . Designed for modern comfort and a perfect tailored fit.
          </p>

          {/* SIZE SELECT */}
          <div className="mb-10">
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Select Size
              </h3>
              <button className="text-sm text-gray-500 underline hover:text-black transition-colors">
                Size Guide
              </button>
            </div>

            <div className="flex gap-3 flex-wrap">
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 rounded-full border flex items-center justify-center font-medium transition-all duration-200
                    ${
                      selectedSize === size
                        ? "border-black bg-black text-white scale-110 shadow-lg"
                        : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-red-600 text-white py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-transform active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-red-100"
            >
              <ShoppingBagIcon className="h-6 w-6" />
              Add to Bag
            </button>

            <button className="w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-colors active:scale-95">
              <HeartIcon className="h-7 w-7" />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            In stock and ready to ship
          </div>
        </div>
      </div>

      {/* SIMILAR ITEMS */}
      <div className="mt-32">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            You Might Also Like
          </h2>
          <a
            href="/explore"
            className="text-sm font-bold border-b-2 border-black pb-0.5 hover:text-gray-600 hover:border-gray-300 transition-colors"
          >
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {similarItems.map((item) => (
            <ProductCard key={item.article_id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
