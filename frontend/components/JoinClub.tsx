"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { registerUser } from "@/lib/api";

const JoinClub = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Use the same auth endpoint as the Signup page
      const res = await registerUser({ email, password: "guest_user" });

      if (res?.status === "success") {
        toast.success("Welcome to the Club! 🎉");
        setIsModalOpen(false);
        setEmail("");
      } else {
        toast.success("Welcome to the Club! 🎉");
        setIsModalOpen(false);
        setEmail("");
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      toast.error(typeof error === "string" ? error : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- BANNER SECTION (Jo screenshot mein tha) --- */}
      <section className="bg-gray-50 py-20 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-gray-900">
          Join the Club
        </h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">
          Become a member today and get 10% off your first purchase plus free returns.
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-transform transform hover:-translate-y-1 shadow-lg"
        >
          Sign Up for Free
        </button>
      </section>

      {/* --- POPUP MODAL (Hidden by default) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>

            {/* Form Content */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Get your 10% Off</h3>
              <p className="text-gray-500 text-sm">Enter your email to unlock exclusive perks.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black text-white py-3.5 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing Up..." : "Join Now"}
              </button>
            </form>
            
            <p className="text-xs text-gray-400 text-center mt-4">
              By joining, you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default JoinClub;