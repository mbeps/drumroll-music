/**
 * Retrieves file sizes from Supabase Storage with fuzzy filename matching.
 *
 * Provides a utility function for looking up file metadata from Supabase Storage
 * when the exact object path is known. Splits the path into parent folder and
 * filename, then uses fuzzy search with exact filename validation to ensure
 * the correct file is matched. Used in storage quota calculations.
 *
 * Side effect: Server-side file system queries to Supabase Storage.
 *
 * @author Maruf Bepary
 */

import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Retrieves the size of a file in bytes from Supabase Storage.
 *
 * Handles path splitting automatically to extract parent folder and filename.
 * Uses Supabase's fuzzy search API with exact filename validation for robustness.
 * Returns 0 if the file is not found or if any error occurs.
 *
 * Side effect: Server-side storage API call to Supabase.
 *
 * @param bucket - Name of the storage bucket (e.g., 'songs', 'avatars')
 * @param path - Full path to the file including folders (e.g., 'user-123/avatar.jpg')
 * @returns Promise resolving to file size in bytes (0 if not found or on error)
 *
 * @see {@link validateStorageLimits} for storage quota context
 *
 * @author Maruf Bepary
 */
export async function getFileSize(bucket: string, path: string): Promise<number> {
  if (!path) return 0;

  const supabase = await createServerSupabaseClient();
  const parts = path.split("/");
  const filename = parts.pop() || "";
  const folder = parts.join("/");

  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    search: filename,
    limit: 1,
  });

  if (error || !data || data.length === 0) return 0;
  
  // Extra safety: ensure the filename matches exactly as list search is fuzzy
  const file = data.find(f => f.name === filename);
  return file?.metadata?.size ?? 0;
}
