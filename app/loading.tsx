"use client";

import { Spinner } from "@/components/ui/spinner";
import Box from "@/components/box";

/**
 * Global loading component that displays a loading animation during route transitions.
 */
const Loading = () => {
  return (
    <Box className="h-full flex items-center justify-center">
      <Spinner className="size-10" />
    </Box>
  );
};

export default Loading;
