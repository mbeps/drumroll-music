/**
 * Per-user storage quota validation (1GB default).
 *
 * This module validates individual upload operations against each user's
 * 1GB storage limit using the `get_user_storage_usage()` RPC to fetch
 * current usage, then computing the net impact for file replacements.
 *
 * @see {@link getUserStorageUsage} for fetching current user storage usage via RPC
 * @author Maruf Bepary
 */

import { FILE_LIMITS } from "@/lib/env";
import { getUserStorageUsage } from "./get-user-storage-usage";

/**
 * Validates if adding a new file (with optional replacement) exceeds the per-user storage limit.
 *
 * Fetches the user's current storage usage via RPC, then computes the net storage increase
 * (newFileSize - oldFileSize). If the resulting total exceeds the 1GB per-user quota,
 * returns an error. Used to prevent uploads that would exceed individual user quotas.
 *
 * Side effect: Calls the `get_user_storage_usage(p_user_id)` RPC to fetch current usage.
 *
 * @param newFileSize - Size of the file being uploaded in bytes
 * @param userId - ID of the user uploading the file
 * @param oldFileSize - Size of the file being replaced in bytes (optional, default 0)
 * @returns Promise resolving to `{ ok: true }` on success or `{ ok: false, error: string }` on quota violation
 *
 * @see {@link validateGlobalStorageLimit} for global quota validation
 * @see {@link FILE_LIMITS} for the 1GB user limit in bytes
 *
 * @author Maruf Bepary
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
