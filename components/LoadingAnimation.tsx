"use client";

import { BounceLoader } from "react-spinners";
import Box from "@/components/Box";

/**
 * Component that displays a centered loading spinner using `BounceLoader`.
 * It is used globally across the application for loading fallbacks in suspense boundaries
 * or standard loading routes to provide visual feedback during data fetching.
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
