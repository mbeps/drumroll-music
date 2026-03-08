"use client";

import { useSupabaseClient } from "@/providers/SupabaseProvider";

/**
 * Resolves a Supabase Storage public URL for an image path.
 * If the value is already a fully-qualified HTTP/HTTPS URL (e.g. an OAuth
 * provider avatar from GitHub or Google), it is returned as-is without going
 * through Supabase Storage.
 *
 * @param imagePath - storage path in the `images` bucket, OR a full external URL
 * @returns public URL string, or null if no path provided
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
