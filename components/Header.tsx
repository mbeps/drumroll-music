"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Header component to be displayed on top of the page.
 * Has a gradient background and a navigation bar.
 * Responsive depending on the screen size:
 * - Mobile: shows home and search buttons
 * @param children (React.ReactNode): items to be rendered inside the header
 * @param className (string): additional styling classes
 * @returns (React.FC): Header component with children inside
 */
const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();

  return (
    <div
      className={twMerge(
        `
				h-fit 
				bg-background
				p-4 border-b border-border
				`,
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <SidebarTrigger className="md:hidden" />
        {/* Mobile View */}
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            onClick={() => router.push("/")}
            className="
              rounded-full 
              p-2 
              bg-white 
              border border-border
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:bg-neutral-100 
              transition
            "
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button
            onClick={() => router.push("/search")}
            className="
              rounded-full
              p-2 
              bg-white 
              border border-border
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:bg-neutral-100 
              transition
            "
          >
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        </div>
      </div>
      {children}
    </div>
  );
};
export default Header;
