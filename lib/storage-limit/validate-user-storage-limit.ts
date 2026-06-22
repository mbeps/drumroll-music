import { FILE_LIMITS } from "@/lib/env";
import { getUserStorageUsage } from "./get-user-storage-usage";

/**
 * Validates if adding a new file (and potentially replacing an old one) 
 * would exceed the per-user storage limit.
 * @param newFileSize - The size of the file to be uploaded in bytes.
 * @param userId - The ID of the user.
 * @param oldFileSize - The size of the file being replaced in bytes (optional).
 * @returns {Promise<{ ok: boolean, error?: string }>} Validation result.
 */
export async function validateUserStorageLimit(
  newFileSize: number,
  userId: string,
  oldFileSize: number = 0
): Promise<{ ok: boolean; error?: string }> {
  const currentUsage = await getUserStorageUsage(userId);
  const netIncrease = newFileSize - oldFileSize;

  if (currentUsage + netIncrease > FILE_LIMITS.USER_STORAGE_LIMIT_BYTES) {
    return {
      ok: false,
      error: `Your personal storage limit reached (${FILE_LIMITS.USER_STORAGE_LIMIT_BYTES / (1024 * 1024 * 1024)}GB). Operation cancelled.`,
    };
  }

  return { ok: true };
}
