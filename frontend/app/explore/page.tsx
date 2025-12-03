"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { fetchFilteredProducts } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function ExplorePage() {
  const searchParams = useSearchParams();

  // Read initial search from URL (?search=shirt)
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState(500);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // ------------------------------------------
  // ⭐ FIXED: Sync URL -> State (search param)
  // ------------------------------------------
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  // ------------------------------------------
  // Load products when filters or search change
  // ------------------------------------------
  useEffect(() => {
    loadProducts();
  }, [search, category, minPrice, maxPrice]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchFilteredProducts({
        search,
        category,
        minPrice,
        maxPrice,
      });
      setProducts(data);
    } catch (err) {
      console.error("Error fetching explore products:", err);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 grid grid-cols-12 gap-6">

      {/* Sidebar */}
      <div className="col-span-3">
        <FilterSidebar
          category={category}
          setCategory={setCategory}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />
      </div>

      {/* Main Content */}
      <div className="col-span-9">

        {/* Search box */}
        <input
          type="text"
          placeholder="Search products..."
          className="border p-3 rounded w-full mb-5"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-black rounded-full"></div>
          </div>
        )}

        {/* Product Grid */}
        {!loading && (
          <div className="grid grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((p) => (
                <ProductCard key={p.article_id} product={p} />
              ))
            ) : (
              <p className="text-gray-500 col-span-3 text-center">
                No products found matching your filters.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
