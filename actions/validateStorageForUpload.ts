"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { validateStorageLimits } from "@/lib/storage-limit";

/**
 * Validates if the proposed upload is allowed under both user and global storage limits.
 * This is a server action intended to be called before initiating an upload from the client.
 * 
 * @param newFileSize - The size of the file to be uploaded in bytes.
 * @param oldFileSize - The size of the file being replaced in bytes (optional).
 * @returns {Promise<{ ok: boolean, error?: string }>} The validation result.
 */
export async function validateStorageForUpload(
  newFileSize: number,
  oldFileSize: number = 0
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Authenticated user not found. Please log in again." };
  }

  return await validateStorageLimits(newFileSize, user.id, oldFileSize);
}
