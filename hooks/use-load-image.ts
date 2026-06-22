/**
 * @fileoverview Generates Supabase Storage public URLs for image files.
 * Handles both internal storage paths and external URLs from OAuth providers.
 * @author Maruf Bepary
 */

"use client";

import { useSupabaseClient } from "@/providers/supabase-provider";

/**
 * Resolves a public URL for an image, either from Supabase Storage or external source.
 * If the path is already a fully-qualified HTTP/HTTPS URL (e.g., from an OAuth provider
 * like GitHub or Google), it is returned as-is. Otherwise, it is treated as a storage path
 * in the `images` bucket and converted to a public URL.
 *
 * @param imagePath - Storage path in the `images` bucket, or a full external HTTP/HTTPS URL.
 * @returns The public URL string for the image, or null if no path is provided.
 * @see useLoadSongUrl for resolving audio file URLs
 * @author Maruf Bepary
 */
const useLoadImage = (imagePath: string | null | undefined): string | null => {
  const supabaseClient = useSupabaseClient();

  if (!imagePath) return null;

  // Already a full URL (e.g. OAuth provider avatar from GitHub/Google CDN) — return as-is.
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const { data } = supabaseClient.storage
    .from("images")
    .getPublicUrl(imagePath);

  return data.publicUrl;
};

export default useLoadImage;
