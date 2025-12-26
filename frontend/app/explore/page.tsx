"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import { fetchProducts, type Product } from "@/lib/api"; // 👈 Ensure this matches your api.ts export
import { AdjustmentsHorizontalIcon, XMarkIcon, CameraIcon } from "@heroicons/react/24/outline";

// Force dynamic rendering so search params work correctly
export const dynamic = "force-dynamic";

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // --- STATE FOR FILTERS ---
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(15000);
  
  // --- STATE FOR SEARCH MODES ---
  const mode = searchParams.get("mode"); // 'visual' or null
  const searchQuery = searchParams.get("search"); 

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync URL search params with local state
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  // --- MAIN DATA LOADING LOGIC ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 📸 CASE 1: VISUAL SEARCH (Read from LocalStorage)
        if (mode === "visual") {
          const storedResults = localStorage.getItem("visual_search_results");
          if (storedResults) {
            setProducts(JSON.parse(storedResults));
          } else {
            setProducts([]); // No results found in storage
          }
        } 
        // 🔎 CASE 2: STANDARD API FETCH (With Filters)
        else {
          // If you named your function 'fetchFilteredProducts', change this line below
          const data = await fetchProducts({
            search: searchQuery || undefined,
            category: category || undefined,
            min_price: minPrice,
            max_price: maxPrice
          });
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce fetching to avoid too many API calls while sliding prices
    const timeoutId = setTimeout(() => {
        loadData();
    }, 300);

    return () => clearTimeout(timeoutId);
    
  }, [mode, searchQuery, category, minPrice, maxPrice]);

  // Handler to clear visual search
  const clearSearch = () => {
    router.push("/explore"); // Reset URL
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* LEFT SIDEBAR (Hide filters during Visual Search to keep focus on results) */}
        {mode !== "visual" && (
          <FilterSidebar 
            category={category}
            setCategory={setCategory}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        )}

        {/* RIGHT CONTENT */}
        <div className="flex-1">
          
          {/* --- HEADER SECTION --- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2 flex items-center gap-3">
                {mode === "visual" ? (
                  <>
                    <CameraIcon className="h-8 w-8 text-red-600" />
                    Visual Match Results
                  </>
                ) : (
                  "Explore Collection"
                )}
              </h1>
              <p className="text-gray-500">
                {mode === "visual" 
                  ? "Here are items that look similar to your uploaded photo." 
                  : `Showing ${products.length} items based on your filters.`}
              </p>
            </div>

             {/* Clear Search Button */}
            {(mode === "visual" || searchQuery) && (
              <button 
                onClick={clearSearch}
                className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 px-5 py-2.5 rounded-full hover:bg-red-100 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
                Clear {mode === "visual" ? "Visual Search" : "Search"}
              </button>
            )}
          </div>

          {/* --- PRODUCT GRID --- */}
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="animate-pulse">
                   <div className="bg-gray-200 aspect-[3/4] rounded-xl mb-4"></div>
                   <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                 </div>
               ))}
             </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.article_id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <AdjustmentsHorizontalIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">No items found</h3>
              <p className="text-gray-500">Try adjusting your filters or upload a different image.</p>
              {mode === "visual" && (
                 <button onClick={clearSearch} className="mt-4 text-blue-600 font-bold hover:underline">
                    Back to all products
                 </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense for Next.js app router compatibility
export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Explore...</div>}>
      <ExploreContent />
    </Suspense>
  );
}