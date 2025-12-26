import React from 'react'; // define the global structure of my application
import { Inter } from 'next/font/google'; 
import '../styles/globals.css';
import Navbar from '@/components/Navbar'; // @ for root directory
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext'; // items, prices , Cartprovider is a wrapper
import { Toaster } from 'react-hot-toast'; // notifications 

const inter = Inter({ subsets: ['latin'] }); // Inter to initialze the font , should always be initialized first and outside the component

export const metadata = { // const means data is static and won't change
  title: 'H&M Fashion Recommender',
  description: 'Personalized fashion recommendations based on your style.',
};
// export means this data can be imported in other files too
// RootLayout is a special component in Next.js that wraps all pages
export default function RootLayout({
  children, // children represent the content of each page like Home, Explore, Product Details etc
}: {
  children: React.ReactNode; // ReactNode means any valid React content (elements, strings, numbers, etc)
}) {
  return ( // returns The HTML structure
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <CartProvider> {/* Cartprovider creates a memory space for cart data*/}
          <Toaster position="top-center" /> {/* Whatever is inside the cartprovider can use the cart data*/}
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <CartDrawer />
            <main className="flex-grow bg-white">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}