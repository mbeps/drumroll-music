import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AlbumWithArtists } from "../types/album-with-artists";

/**
 * Merges Tailwind CSS classes with clsx and twMerge.
 * Use this to conditionally apply Tailwind classes without styling conflicts.
 *
 * @param inputs - Array of class names or conditional class objects.
 * @returns A single string of merged Tailwind classes.
 * @see {@link https://github.com/dcastil/tailwind-merge} for merging logic.
 * @author Maruf Bepary
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a list of artists into a human-readable string.
 * Use this in UI components to display contributing artists for an album or song.
 * Displays "Unknown Artist" if the provided list is empty.
 *
 * @param album - The album or song object containing an array of artists.
 * @returns A comma-separated list of artist names or a fallback.
 * @author Maruf Bepary
 */
export function formatArtists(album: AlbumWithArtists): string {
  if (!album.artists.length) return "Unknown Artist";
  return album.artists.map((a) => a.name).join(", ");
}

/**
 * Shared responsive grid class string for entity cards.
 * Use this to maintain consistent spacing and columns across all entity lists.
 * This should be applied to the container element of song, album, or artist cards.
 *
 * @author Maruf Bepary
 */
export const GRID_CLASSES =
  "grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8";

/**
 * Extracts the first two initials from a name string.
 * Use this for avatar fallbacks when a user or artist image is not available.
 *
 * @param name - The full name or string to extract initials from.
 * @returns Up to two uppercase initials if they exist.
 * @author Maruf Bepary
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
