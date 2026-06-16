import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes using clsx and twMerge.
 * Handles conditional styling without conflicts.
 * Required for Shadcn UI components.
 *
 * @param inputs - Class values (strings, objects, arrays)
 * @returns Merged Tailwind class string
 *
 * @example
 * cn("px-4", { "text-red-500": isError }, ["py-2"])
 * // Output: "px-4 py-2 text-red-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
