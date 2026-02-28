"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

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
  return (
    <div
      className={twMerge(
        `
				h-fit 
				bg-background
				p-4
				`,
        className
      )}
    >
      {heading && (
        <h1 className="text-foreground text-3xl font-semibold mb-4">{heading}</h1>
      )}
      {children}
    </div>
  );
};
export default Header;
