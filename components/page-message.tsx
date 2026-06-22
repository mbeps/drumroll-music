"use client";

import Box from "@/components/box";
import React from "react";

/**
 * Centered page message for empty states, errors, and notifications.
 * Displays a primary heading and secondary description within a full-page container.
 * Commonly used for 404 errors, empty results, and status messages.
 *
 * @author Maruf Bepary
 */

interface PageMessageProps {
  /** Primary message heading displayed in red. */
  title: string;
  /** Secondary descriptive text displayed below the title. */
  description: string;
}

/**
 * Renders a centered message box with title and description.
 *
 * @param props - See PageMessageProps
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
