import React from "react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface FilterSidebarProps {
  category: string;
  setCategory: (val: string) => void;
  minPrice: number;
  setMinPrice: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  className?: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  className = ""
}) => {
  
  const handleClear = () => {
    setCategory("");
    setMinPrice(0);
    setMaxPrice(10000);
  };

  const categories = ["Tops", "Denim", "Hoodies", "Shirts", "Trousers", "Dresses", "Jackets", "Shoes", "Accessories"];

  return (
    <div className={`w-full md:w-64 flex-shrink-0 ${className}`}>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <FunnelIcon className="h-5 w-5" /> Filters
          </h2>
          {(category || minPrice > 0 || maxPrice < 10000) && (
            <button 
              onClick={handleClear}
              className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <XMarkIcon className="h-3 w-3" /> Clear
            </button>
          )}
        </div>

        {/* --- Category Filter --- */}
        <div className="mb-8">
          <label className="text-sm font-bold text-gray-900 mb-3 block uppercase tracking-wider">
            Category
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value=""
                checked={category === ""}
                onChange={(e) => setCategory(e.target.value)}
                className="w-4 h-4 text-black border-gray-300 focus:ring-black"
              />
              <span className={`text-sm ${category === "" ? "font-bold text-black" : "text-gray-600 group-hover:text-black"}`}>
                All Categories
              </span>
            </label>
            
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={category === cat}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                />
                <span className={`text-sm ${category === cat ? "font-bold text-black" : "text-gray-600 group-hover:text-black"}`}>
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* --- Price Range --- */}
        <div>
          <label className="text-sm font-bold text-gray-900 mb-4 block uppercase tracking-wider">
            Price Range
          </label>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-2 text-gray-500">
                <span>Min</span>
                <span className="font-bold text-black">₹{minPrice}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5000}
                step={100}
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2 text-gray-500">
                <span>Max</span>
                <span className="font-bold text-black">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={15000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FilterSidebar;