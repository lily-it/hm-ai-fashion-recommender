"use client";

import { useEffect, useState } from "react";
import { getWishlist } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const data = await getWishlist("123");
    setItems(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-5">My Wishlist</h1>

      <div className="grid grid-cols-3 gap-6">
        {items.map((product: any) => (
          <ProductCard key={product.article_id} product={product} />
        ))}
      </div>
    </div>
  );
}
