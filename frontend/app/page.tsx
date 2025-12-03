"use client";

import React, { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import RecommendationSection from "@/components/RecommendationSection";
import ProductCard from "@/components/ProductCard";

import {
  fetchRecommendations,
  fetchTrending,
} from "@/lib/api";

import type { Product } from "@/lib/types";  // ✅ FIXED TYPE IMPORT

const HomePage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch in parallel for speed
        const [recs, trend] = await Promise.all([
          fetchRecommendations("123"),
          fetchTrending(),
        ]);

        setRecommendations(recs);
        setTrending(trend);
      } catch (err) {
        console.error("Failed to load homepage data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Full-width Hero */}
      <HeroSection />

      {/* Content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-24">
        
        {/* Personalized Recommendations */}
        <div className="mt-24">
          <RecommendationSection recommendations={recommendations} />
        </div>

        {/* Trending Section */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Trending Now
            </h2>

            <a
              href="/explore"
              className="text-sm font-bold border-b-2 border-black pb-0.5 hover:text-gray-600 hover:border-gray-300 transition-colors"
            >
              View All
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {trending.map((item) => (
              <ProductCard key={item.article_id} product={item} priority={false} />
            ))}
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="mt-32 bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
          <h3 className="text-2xl font-bold mb-4 tracking-tight">Join the Club</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Become a member today and get 10% off your first purchase plus free returns.
          </p>
          <button className="bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg">
            Sign Up for Free
          </button>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
