"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
  heading?: string;
}

/**
 * Header component to be displayed on top of the page.
 * Has a gradient background and a navigation bar.
 * Responsive depending on the screen size:
 * - Mobile: shows home and search buttons
 * @param children (React.ReactNode): items to be rendered inside the header
 * @param className (string): additional styling classes
 * @param heading (string): optional page heading rendered below the navigation bar
 * @returns (React.FC): Header component with children inside
 */
const Header: React.FC<HeaderProps> = ({ children, className, heading }) => {
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
              bg-secondary 
              border border-border
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:bg-accent 
              transition
            "
          >
            <HiHome className="text-foreground" size={20} />
          </button>
          <button
            onClick={() => router.push("/search")}
            className="
              rounded-full
              p-2 
              bg-secondary 
              border border-border
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:bg-accent 
              transition
            "
          >
            <BiSearch className="text-foreground" size={20} />
          </button>
        </div>
        </div>
      </div>
      {heading && (
        <h1 className="text-foreground text-3xl font-semibold mb-4">{heading}</h1>
      )}
      {children}
    </div>
  );
};
export default Header;
