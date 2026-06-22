import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Retrieves the size of a file in bytes from Supabase Storage.
 * Handles path splitting to parent folder and filename automatically.
 * 
 * @param bucket - The storage bucket name.
 * @param path - The full path to the file.
 * @returns {Promise<number>} File size in bytes, or 0 if not found or on error.
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
