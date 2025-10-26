import Link from "next/link";
import { useState } from "react";

type User = {
  id: string;
  name?: string;
  email?: string;
} | null;

type NavigationProps = {
  user?: User;
};

function Navigation({ user }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-8 py-3 flex justify-between items-center">
        {/* Logo/Brand */}
        <button  className="text-2xl font-bold text-gray-900 focus:outline-none">
          InstaPortfolio
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <button
                
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Dashboard
              </button>
              <button
                
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Settings
              </button>
            </>
          ) : (
            <Link href={"/login"}>
                <button
                // onClick={}
                className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                Create Your Portfolio
                </button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            {user ? (
              <>
                <button
                  
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full text-center"
                >
                  Dashboard
                </button>
                <button
                  
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full text-center"
                >
                  Settings
                </button>
              </>
            ) : (
                <Link href={"/login"}>
                    <button
                        // onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
                        className="block w-full px-4 py-2 rounded-full bg-blue-600 text-white font-semibold text-center mt-2"
                    >
                        Create Your Portfolio
                    </button>
                </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;