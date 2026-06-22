"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

/**
 * Fixed header component for consistent page-level context and branding.
 * Provides a dedicated area for headings and contextual actions across all routes.
 *
 * @author Maruf Bepary
 */

interface HeaderProps {
  /** Optional elements to render in the header's action area (right-aligned). */
  children?: React.ReactNode;
  /** Optional Tailwind classes for custom styling and layout adjustments. */
  className?: string;
  /** Optional heading text displayed prominently at the top of the header. */
  heading?: string;
}

/**
 * Renders a fixed header with optional title and action area for navigation and controls.
 *
 * @param props - See HeaderProps
 * @author Maruf Bepary
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
