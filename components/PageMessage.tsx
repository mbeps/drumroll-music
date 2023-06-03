"use client";

import Box from "@/components/Box";
import React from "react";

interface PageMessageProps {
  title: string;
  description: string;
}

const PageMessage: React.FC<PageMessageProps> = ({ title, description }) => {
  return (
    <Box className="h-full flex items-center justify-center">
      <div className="flex justify-between items-center">
        <div className="grid align-items-center gap-4">
          <h1 className=" text-3xl font-semibold text-red-500">{title}</h1>
          <h2 className="text-white text-xl font-medium">{description}</h2>
        </div>
      </div>
    </Box>
  );
};

export default PageMessage;
