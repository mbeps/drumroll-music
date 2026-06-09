import { createServerSupabaseClient } from "@/utils/supabase/server";
import { FILE_LIMITS } from "@/lib/env";

/**
 * Retrieves the total global storage usage by calling the get_global_storage_usage RPC.
 * @returns {Promise<number>} Total storage usage in bytes.
 */
export async function getGlobalStorageUsage(): Promise<number> {
  const supabase = await createServerSupabaseClient();
  // @ts-expect-error - RPC might not be in generated types
  const { data, error } = await supabase.rpc("get_global_storage_usage");

  if (error) {
    console.error("Error fetching global storage usage:", error);
    return 0;
  }

  return Number(data ?? 0);
}

/**
 * Validates if adding a new file (and potentially replacing an old one) 
 * would exceed the global storage limit.
 * @param newFileSize - The size of the file to be uploaded in bytes.
 * @param oldFileSize - The size of the file being replaced in bytes (optional).
 * @returns {Promise<{ ok: boolean, error?: string }>} Validation result.
 */
export async function validateGlobalStorageLimit(
  newFileSize: number,
  oldFileSize: number = 0
): Promise<{ ok: boolean; error?: string }> {
  const currentUsage = await getGlobalStorageUsage();
  const netIncrease = newFileSize - oldFileSize;
  
  if (currentUsage + netIncrease > FILE_LIMITS.GLOBAL_STORAGE_LIMIT_BYTES) {
    return {
      ok: false,
      error: `Application storage limit reached (${FILE_LIMITS.GLOBAL_STORAGE_LIMIT_BYTES / (1024 * 1024 * 1024)}GB). Operation cancelled.`,
    };
  }

  return { ok: true };
}

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
