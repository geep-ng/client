

/** Detailed Footer Component */
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-8">
          {/* Logo & Mission */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-extrabold text-blue-400 mb-4">GEEP 2027</h3>
            <p className="text-sm text-gray-400">
              The platform for Connecting, Empowering, and Mobilizing Nigerian graduates for a prosperous future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#hero" className="text-gray-400 hover:text-blue-400 transition">Home</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition">Features Overview</a></li>
              <li><a href="#countdown" className="text-gray-400 hover:text-blue-400 transition">Launch Timeline</a></li>
              <li><a href="#waitlist" className="text-gray-400 hover:text-blue-400 transition">Join Waitlist</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Legal & Policies</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Terms of Use</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Data Security</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Ambassador Code</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
            <p className="text-sm text-gray-400">
              Email: info@geep2027.ng<br />
              Lagos, Nigeria.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition"> {/* Mock Social Icon */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.309 8.216l.204-1.353-.263.042c-.521.084-1.295.034-2.07-.468l-1.07-1.13c-.112-.119-.328-.184-.504-.184H9.957c-.552 0-.974.437-.959.95l.081.936c.015.176-.05.392-.17.504l-1.13 1.07c-.502.775-.552 1.549-.468 2.07l.042.263 1.353-.204c.176-.027.392.038.504.158l.847.888c.099.104.225.163.355.163H12c.13 0 .256-.059.355-.163l.888-.847c.12-.112.336-.177.504-.163l1.353.204.042-.263c.084-.521.034-1.295-.468-2.07l-1.13-1.07c-.112-.119-.177-.336-.163-.504l.204-1.353z"/></svg>
              </a>
              {/* Add more social icons here (Twitter, Facebook, etc.) */}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} GEEP Project. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;