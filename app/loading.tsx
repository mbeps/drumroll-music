"use client";

import Box from "@/components/box";
import { Spinner } from "@/components/ui/spinner";

/**
 * Global loading component that displays a loading animation during route transitions.
 */
const Loading = () => {
  return (
    <Box className="flex h-full items-center justify-center">
      <Spinner className="size-10" />
    </Box>
  );
};

export default Loading;
