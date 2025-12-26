"use client";

import React, { useState } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-black text-white text-xs font-bold px-4 py-2.5 relative z-[60]">
      <div className="max-w-7xl mx-auto flex justify-center items-center text-center">
        <p className="tracking-wide uppercase">
          Free Shipping on Orders Over $50 | Returns within 30 days
        </p>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-800 rounded-full transition-colors"
        >
          <XMarkIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
