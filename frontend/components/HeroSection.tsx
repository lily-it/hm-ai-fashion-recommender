"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop",
    subtitle: "NEW ARRIVALS",
    title: "The Spring Collection",
    desc: "Fresh styles for the new season. Discover lightweight fabrics and effortless silhouettes.",
    cta: "Shop Now",
    link: "/explore",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
    subtitle: "URBAN ESSENTIALS",
    title: "City Life Redefined",
    desc: "Bold coats and modern layers designed for the concrete jungle.",
    cta: "View Streetwear",
    link: "/explore?category=Jackets",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    subtitle: "SUSTAINABLE CHOICE",
    title: "Conscious Fashion",
    desc: "Look good, feel good. Explore our range of eco-friendly materials.",
    cta: "Learn More",
    link: "/explore",
  },
];

const HeroSection: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-[85vh] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            priority
            loading="eager"
            sizes="100vw"
            className="object-cover object-center brightness-75"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* TEXT CONTENT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.div
          key={`text-${current}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl"
        >
          <span className="text-white/90 font-bold tracking-[0.3em] uppercase mb-4 block text-sm md:text-base border-b-2 border-red-600 inline-block pb-1">
            {slides[current].subtitle}
          </span>

          <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black mb-6 drop-shadow-2xl tracking-tight">
            {slides[current].title}
          </h1>

          <p className="text-gray-200 text-lg md:text-2xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            {slides[current].desc}
          </p>

          <Link href={slides[current].link}>
            <button className="bg-white text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-red-600 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] transform hover:-translate-y-1">
              {slides[current].cta}
            </button>
          </Link>
        </motion.div>
      </div>

      {/* ARROWS */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all z-20 backdrop-blur-sm hidden md:block"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all z-20 backdrop-blur-sm hidden md:block"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              current === index
                ? "w-12 bg-white"
                : "w-2 bg-white/40 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
