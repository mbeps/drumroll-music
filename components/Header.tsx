"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
  heading?: string;
}

/**
 * A persistent header component that provides navigation and page-level context.
 * Features a dynamic gradient background and responsive navigation controls.
 * In mobile views, it adapts to show condensed navigation (Home/Search).
 *
 * @author Maruf Bepary
 * @param children Optional elements to be rendered in the header's right action area.
 * @param className Optional additional styling classes for the container.
 * @param heading Optional title text displayed prominently within the header.
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
