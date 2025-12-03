"use client";

import React from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";   // ✅ FIXED TYPE IMPORT

interface RecommendationSectionProps {
  recommendations: Product[];
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  recommendations,
}) => {
  if (!recommendations.length) {
    return (
      <section className="my-8 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Personalized Recommendations</h2>
        <p className="text-gray-500">No recommendations yet.</p>
      </section>
    );
  }

  return (
    <section className="my-8 max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Personalized Recommendations</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommendations.map((item, index) => (
          <ProductCard
            key={item.article_id}
            product={item}
            priority={index < 4} // Load first 4 images earlier for LCP
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendationSection;
