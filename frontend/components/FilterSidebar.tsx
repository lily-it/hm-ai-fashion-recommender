"use client";

import React from "react";

interface FilterSidebarProps {
  category: string;
  setCategory: (val: string) => void;
  minPrice: number;
  setMinPrice: (val: number | ((prev: number) => number)) => void;
  maxPrice: number;
  setMaxPrice: (val: number | ((prev: number) => number)) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">

      <h2 className="font-bold mb-3">Filters</h2>

      {/* Category Filter */}
      <label className="font-semibold">Category</label>
      <select
        className="border p-2 rounded w-full mb-4"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All</option>
        <option value="Tops">Tops</option>
        <option value="Denim">Denim</option>
        <option value="Hoodies">Hoodies</option>
        <option value="Shirts">Shirts</option>
        <option value="Trousers">Trousers</option>
        <option value="Shoes">Shoes</option>
        <option value="Accessories">Accessories</option>
      </select>

      {/* Price Range */}
      <label className="font-semibold">Min Price: ₹{minPrice}</label>
      <input
        type="range"
        min={500}
        max={10000}
        value={minPrice}
        onChange={(e) => setMinPrice(Number(e.target.value))}
        className="w-full"
      />

      <label className="font-semibold mt-3 block">Max Price: ₹{maxPrice}</label>
      <input
        type="range"
        min={500}
        max={10000}
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
};

export default FilterSidebar;
