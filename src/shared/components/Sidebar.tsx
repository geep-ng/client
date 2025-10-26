import React from "react";
import { SidebarItem } from "./SidebarItem";
import { Menu } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "🏠", link: "/app" },
  { key: "transactions", label: "Transactions", icon: "💸", link: "/app/transactions" },
  { key: "profile", label: "Profile", icon: "👤", link: "/profile" },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  activeTab,
  setActiveTab,
}) => {
  const handleItemClick = (key: string) => {
    setActiveTab(key);

    // Auto-close sidebar on mobile
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-100 dark:bg-gray-900 transition-all duration-300 ease-in-out z-40
          ${isOpen ? "w-52" : "w-0"}
          ${!isOpen && "md:w-20"} md:block`}
      >
        <div className="flex flex-col h-full p-3 md:p-4">
          {/* Logo + Toggle */}
          <div className="flex items-center justify-between h-16">
            {isOpen && (
              <span className="text-blue-500 font-extrabold text-2xl tracking-wide">
                Radon <span className=" text-neutral-300">Pay</span>
              </span>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors md:hidden"
            >
              {isOpen ? "←" : (
                <>
                  <Menu />
                </>
              )}
            </button>
          </div>

          {/* Nav */}
          <nav className="mt-8 flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <SidebarItem
                  key={item.key}
                  item={item}
                  active={activeTab === item.key}
                  isOpen={isOpen}
                  onClick={() => handleItemClick(item.key)}
                />
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Overlay on Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};