import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AlbumWithArtists } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatArtists(album: AlbumWithArtists): string {
  if (!album.artists.length) return "Unknown Artist";
  return album.artists.map((a) => a.name).join(", ");
}

export const GRID_CLASSES =
  "grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8";
