"use client";

import { useState } from "react";

export default function Home() {

  return (
    <div className="min-h-screen max-h-screen flex justify-center">
      {/* Main Space Awesome Very Cool Section */}
      <section className="py-16 px-6 flex items-center justify-center cursor-none select-none">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-tr from-neutral-200 mask-t-to-gray-800 bg-clip-text text-transparent animate-fade-in"
            data-project-area="true">
            Hello.
          </h2>
          <p className="text-xl z-50 md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            
          </p>
          {/* <a 
            href="#projects" 
            className="relative z-50 inline-block bg-neutral-700/30 text-white px-8 py-4 rounded-full backdrop-blur-md shadow-lg hover:bg-neutral-600/40 transition-all duration-500 font-medium border border-white/20 cursor-none group overflow-hidden"
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-150 transition-all duration-700 ease-out blur-sm group-hover:blur-md"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-125 transition-all duration-500 ease-out blur-xs"></div>
            <span className="text-lg font-light relative z-10 flex items-center justify-center leading-none">Jump</span>
          </a> */}
        </div>
      </section>
    </div>
  );
}
