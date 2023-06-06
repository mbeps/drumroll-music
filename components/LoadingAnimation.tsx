"use client";

import { BounceLoader } from "react-spinners";
import Box from "@/components/Box";

/**
 * Loading animation component which displays a loading animation.
 * This is used on loading pages while content is being fetched.
 *
 * @returns (React.ReactNode): loading animation
 */
const LoadingAnimation = () => {
  return (
    <Box className="h-full flex items-center justify-center">
      <BounceLoader color="#ff0000" size={40} />
    </Box>
  );
};

export default LoadingAnimation;
