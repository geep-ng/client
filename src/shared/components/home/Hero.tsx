/** Hero section with descriptive text and subtle animation/parallax effects */
const Hero: React.FC = () => {
  return (
    <section id="hero" className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white min-h-screen flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-2 block">
              Graduate Engagement & Empowerment Portal
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
              Mobilizing Nigeria&apos;s <span className="text-blue-600">Future Leaders</span>.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              GEEP is the dynamic digital platform connecting Nigerian graduates to the Tinubu–Alia vision, providing exclusive access to jobs, grants, skills training, and campaign mobilization efforts for 2027 and beyond.
            </p>
            <div className="flex space-x-4">
              <a href="#waitlist" className="py-3 px-8 text-white bg-blue-700 rounded-xl font-semibold shadow-xl hover:bg-blue-800 transition duration-300 transform hover:scale-105">
                Secure Your Spot
              </a>
              <a href="#features" className="py-3 px-8 text-blue-700 bg-white border border-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition duration-300">
                Explore Features
              </a>
            </div>
          </div>

          {/* Visual Element (Mock Animation/Visual) */}
          <div className="order-1 md:order-2 relative flex justify-center items-center">
            <div className="w-72 h-72 md:w-96 md:h-96 bg-blue-100 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow">
              <svg className="w-2/3 h-2/3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="absolute top-10 right-10 p-2 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold shadow-md transform rotate-6">
              Empowerment
            </div>
            <div className="absolute bottom-10 left-10 p-2 bg-green-400 text-green-900 rounded-full text-xs font-bold shadow-md transform -rotate-6">
              Mobilization
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero