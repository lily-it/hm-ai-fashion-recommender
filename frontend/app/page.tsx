"use client";// This file will run on the browser not on the server

import React, { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import RecommendationSection from "@/components/RecommendationSection";
import ProductCard from "@/components/ProductCard";
import JoinClub from "@/components/JoinClub";
import {
  fetchRecommendations,
  fetchTrending,
} from "@/lib/api";
// FIX: Ensure Product type is imported from correct file (usually api.ts)
import type { Product } from "@/lib/api"; 

const HomePage: React.FC = () => { // HomePage is a React Functional Component 
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // --- MISSING LOGIC FIXED HERE ---
        // 1. LocalStorage se asli User ID nikalo
        let userId = localStorage.getItem("user_id");
        
        // Agar user logged out hai, toh "0" bhejo (Backend isse Cold Start treat karega)
        if (!userId) userId = "0";

        console.log("Fetching recs for User:", userId);

        // 2. Fetch in parallel
        const [recs, trend] = await Promise.all([
          fetchRecommendations(userId), // ✅ Ab yahan "123" nahi, real ID jayegi
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
        {/* Sirf tab dikhao jab recommendations ho */}
        {recommendations.length > 0 && (
            <div className="mt-24">
            <RecommendationSection recommendations={recommendations} /> {/*  Hey RecommendationSection, main tumhe recommendations(prop) naam ka data de raha hoon*/}
            </div>
        )}

        {/* Trending Section */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{/*tracking-tight means letter spacing*/}
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
              <ProductCard key={item.article_id} product={item} />
            ))}
          </div>
        </section>

        {/* Newsletter / Signup */}
        <div className="mt-32 rounded-2xl overflow-hidden border border-gray-100">
           <JoinClub />
        </div>

      </div>
    </div>
  );
};

export default HomePage;