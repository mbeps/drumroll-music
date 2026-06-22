/**
 * Artist name formatting utilities for display in the UI.
 *
 * Provides functions to format and present artist information from album contexts.
 * Used in song cards, album listings, and detail pages.
 *
 * @author Maruf Bepary
 */

import type { AlbumWithArtists } from "@/types/music/album-with-artists";

/**
 * Formats an album's artist list into a human-readable string.
 * Used for displaying artist attribution in song/album cards and detail pages.
 *
 * @param album - Album object with artist relationships
 * @returns Comma-separated artist names, or "Unknown Artist" if empty
 *
 * @example
 * formatArtists({ ...album, artists: [{ name: "John" }, { name: "Jane" }] })
 * // Output: "John, Jane"
 *
 * formatArtists({ ...album, artists: [] })
 * // Output: "Unknown Artist"
 *
 * @author Maruf Bepary
 */
export function formatArtists(album: AlbumWithArtists): string {
  if (!album.artists.length) return "Unknown Artist";
  return album.artists.map((a) => a.name).join(", ");
}
