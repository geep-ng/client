"use client";

import { useState } from "react";

/** The main responsive navigation header component */
const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 text-xl font-extrabold text-blue-700 tracking-tight">
            GEEP <span className="text-gray-900 font-medium text-sm hidden sm:inline-block">| Portal 2027</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 font-medium">
            <a href="#hero" className="text-gray-600 hover:text-blue-700 transition duration-150">Home</a>
            <a href="#features" className="text-gray-600 hover:text-blue-700 transition duration-150">Features</a>
            <a href="#countdown" className="text-gray-600 hover:text-blue-700 transition duration-150">Launch</a>
            <a href="#waitlist" className="py-1 px-4 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-150 shadow-lg">Join Waitlist</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
            aria-expanded={isOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <a href="#hero" className="block w-full text-center py-2 text-gray-700 hover:bg-blue-50 rounded-md" onClick={() => setIsOpen(false)}>Home</a>
            <a href="#features" className="block w-full text-center py-2 text-gray-700 hover:bg-blue-50 rounded-md" onClick={() => setIsOpen(false)}>Features</a>
            <a href="#countdown" className="block w-full text-center py-2 text-gray-700 hover:bg-blue-50 rounded-md" onClick={() => setIsOpen(false)}>Launch</a>
            <a href="#waitlist" className="block w-11/12 text-center py-2 mt-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700" onClick={() => setIsOpen(false)}>Join Waitlist</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;