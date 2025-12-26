"use client";

import { useState, useRef } from "react";
import { XMarkIcon, PhotoIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ImageSearchModal({ isOpen, onClose }: any) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSearch = async () => {
    if (!selectedImage) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      // Backend API Call
      const res = await fetch("http://localhost:8000/search-by-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      
      // Save results to local storage to show on Explore page (Simple Hack)
      localStorage.setItem("visual_search_results", JSON.stringify(data));
      
      toast.success("Found similar styles! 👗");
      router.push("/explore?mode=visual"); // Redirect user
      onClose();

    } catch (error) {
      console.error(error);
      toast.error("Visual search failed, try another image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md relative overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg">Visual Search 🤖</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col items-center">
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-black transition-all group relative overflow-hidden"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
            ) : (
              <>
                <div className="p-4 bg-gray-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                   <PhotoIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600">Click to upload photo</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG supported</p>
              </>
            )}
            <input 
               type="file" 
               ref={fileInputRef} 
               hidden 
               accept="image/*" 
               onChange={handleFileChange} 
            />
          </div>

          <button 
            onClick={handleSearch}
            disabled={!selectedImage || loading}
            className="w-full mt-6 bg-black text-white py-3.5 rounded-full font-bold shadow-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scanning AI Model...
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="h-5 w-5" />
                Find Similar Items
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}