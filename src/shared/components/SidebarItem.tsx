import Link from "next/link";
import React from "react";

interface SidebarItemProps {
  item: {
    icon: React.ReactNode;
    label: string;
    link: string;
  };
  active: boolean;
  isOpen: boolean;
  onClick: () => void;
}

export const SidebarItem = ({
  item,
  active,
  isOpen,
  onClick,
}: SidebarItemProps) => {
  if (!isOpen) return null; // 🔥 Hide completely when sidebar is collapsed

  return (
    <li>
      <Link href={item.link} passHref>
        <button
          onClick={onClick}
          className={`flex items-center space-x-3 p-3 rounded-md w-full text-left transition-colors duration-200 ${
            active
              ? "bg-blue-600 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </button>
      </Link>
    </li>
  );
};