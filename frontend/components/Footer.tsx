import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-white mb-6">
              H&M <span className="text-red-600">Recommender</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your personal AI fashion stylist. Discover trends tailored to your unique taste and style preferences.
            </p>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Shop</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="/explore?category=Denim" className="hover:text-white transition-colors">Denim</a></li>
              <li><a href="/explore?category=Hoodies" className="hover:text-white transition-colors">Hoodies</a></li>
              <li><a href="/explore?category=Dresses" className="hover:text-white transition-colors">Dresses</a></li>
              <li><a href="/explore" className="hover:text-white transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Help</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Find a Store</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Legal & Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Stay in the loop</h3>
            <p className="text-gray-400 text-sm mb-4">Sign up for exclusive offers and style news.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-500 w-full"
              />
              <button className="bg-red-600 px-4 py-2 rounded-r-md font-bold hover:bg-red-700 transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
       <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
  <p className="text-xs text-gray-500 text-center md:text-left">
    © 2025 H&M Fashion Recommender. Built with ❤️ by{" "}
    <a
      href="https://github.com/showlittlemercy"
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-white"
    >
      Priyanshu (@showlittlemercy)
    </a>.
  </p>

  <div className="flex space-x-6 text-gray-400">
    <a
      href="https://github.com/showlittlemercy"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition-colors"
    >
      GitHub
    </a>

    <a
      href="https://www.linkedin.com/in/priyanshu-thakur-a47774360/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition-colors"
    >
      LinkedIn
    </a>
    <span className="text-gray-300">|</span>
    <a
      href="https://www.instagram.com/showlittlemercy/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition-colors"
    >
      Instagram
    </a>
  </div>
</div>
      </div>
    </footer>
  );
};

export default Footer;
