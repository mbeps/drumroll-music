"use client";

import Box from "@/components/Box";
import React from "react";

interface PageMessageProps {
  title: string;
  description: string;
}

/**
 * A reusable message component for centered, full-page messaging.
 * Useful for 404 pages, empty states, or error messages where a simple
 * title and description are required. It uses a red accent for the primary heading.
 *
 * @param title - The prominently displayed primary heading.
 * @param description - Detailed secondary message text.
 * @author Maruf Bepary
 */
const PageMessage: React.FC<PageMessageProps> = ({ title, description }) => {
  return (
    <Box className="h-full flex items-center justify-center">
      <div className="flex justify-between items-center">
        <div className="grid align-items-center gap-4">
          <h1 className=" text-3xl font-semibold text-red-500">{title}</h1>
          <h2 className="text-foreground text-xl font-medium">{description}</h2>
        </div>
      </div>
    </Box>
  );
};

export default PageMessage;
