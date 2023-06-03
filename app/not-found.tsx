"use client";

import Box from "@/components/Box";

export const revalidate = 0; // page will not be cached

export default async function NotFound() {
  return (
    <Box className="h-full flex items-center justify-center">
      <div className="flex justify-between items-center">
        <div className="grid align-items-center gap-4">
          <h1 className=" text-3xl font-semibold text-red-500">
            404: Page Not Found
          </h1>
          <h2 className="text-white text-xl font-medium">
            This page does not exist. Try navigating to a different page.
          </h2>
        </div>
      </div>
    </Box>
  );
}
