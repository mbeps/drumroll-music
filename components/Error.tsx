"use client";

import Box from "@/components/Box";

const ErrorMessage = () => {
  return (
    <Box className="h-full flex items-center justify-center">
      <div className="flex justify-between items-center">
        <div className="grid align-items-center gap-4">
          <h1 className=" text-3xl font-semibold text-red-500">
            Something went wrong
          </h1>
          <h2 className="text-white text-xl font-medium">
            There has been an unknown error. More info in the Dev console.
          </h2>
        </div>
      </div>
    </Box>
  );
};

export default ErrorMessage;
