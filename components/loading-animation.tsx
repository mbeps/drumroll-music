"use client";

import { BounceLoader } from "react-spinners";
import Box from "@/components/box";

/**
 * Fullscreen loading fallback component with animated bounce spinner.
 * Displays centered loading indicator for async operations and route transitions.
 * Used in route-level and suspense-level fallbacks.
 *
 * @author Maruf Bepary
 */
const LoadingAnimation = () => {
  return (
    <Box className="h-full flex items-center justify-center">
      <BounceLoader color="#ff0000" size={40} />
    </Box>
  );
};

export default LoadingAnimation;
