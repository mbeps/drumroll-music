"use client";

import { useEffect, type ReactNode } from "react";
import { configureLogging } from "@/lib/logger";

interface LoggingProviderProps {
  children: ReactNode;
}

/**
 * Provider component that initializes client-side logging.
 * It ensures that LogTape is configured when the application starts in the browser.
 */
export function LoggingProvider({ children }: LoggingProviderProps) {
  useEffect(() => {
    configureLogging();
  }, []);

  return <>{children}</>;
}
