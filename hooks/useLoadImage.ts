"use client";

import { useSupabaseClient } from "@/providers/SupabaseProvider";

/**
 * Resolves a Supabase Storage public URL for an image path.
 *
 * @param imagePath - storage path in the `images` bucket
 * @returns public URL string, or null if no path provided
 */
const useLoadImage = (imagePath: string | null | undefined): string | null => {
  const supabaseClient = useSupabaseClient();

  if (!imagePath) return null;

  const { data } = supabaseClient.storage
    .from("images")
    .getPublicUrl(imagePath);

  return data.publicUrl;
};

export default useLoadImage;
