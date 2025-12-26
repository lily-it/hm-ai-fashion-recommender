"use client";

import React from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";   // ✅ FIXED TYPE IMPORT

interface ProductGridProps {
  products: Product[];
  title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title }) => {
  if (!products?.length) return null;

  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product.article_id}
            product={product}
            priority={index === 0} // First one is LCP for performance
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
