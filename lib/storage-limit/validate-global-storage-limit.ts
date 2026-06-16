import { FILE_LIMITS } from "@/lib/env";
import { getGlobalStorageUsage } from "./get-global-storage-usage";

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
