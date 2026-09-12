"use client";

import type React from "react";
import Box from "@/components/ui/box";

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
    <Box className="flex h-full items-center justify-center">
      <div className="flex items-center justify-between">
        <div className="grid gap-4 align-items-center">
          <h1 className="font-semibold text-3xl text-red-500">{title}</h1>
          <h2 className="font-medium text-foreground text-xl">{description}</h2>
        </div>
      </div>
    </Box>
  );
};

export default PageMessage;
