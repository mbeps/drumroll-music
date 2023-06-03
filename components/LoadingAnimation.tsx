"use client";

import { BounceLoader } from "react-spinners";

import Box from "@/components/Box";

const LoadingAnimation = () => {
  return (
    <Box className="h-full flex items-center justify-center">
      <BounceLoader color="#ff0000" size={40} />
    </Box>
  );
};

export default LoadingAnimation;
