/**
 * Global application storage quota validation (50GB default).
 *
 * This module validates upload operations against the application-wide
 * 50GB storage limit using the `get_global_storage_usage()` RPC to fetch
 * total usage, then computing the net impact for file replacements.
 *
 * @see {@link getGlobalStorageUsage} for fetching current global storage usage via RPC
 * @author Maruf Bepary
 */

import { FILE_LIMITS } from "@/lib/env";
import { getGlobalStorageUsage } from "./get-global-storage-usage";

/**
 * Validates if adding a new file (with optional replacement) exceeds the global storage limit.
 *
 * Fetches the application's current total storage usage via RPC, then computes the net
 * storage increase (newFileSize - oldFileSize). If the resulting total exceeds the 50GB
 * global quota, returns an error. Used to prevent uploads that would exceed the entire
 * application's storage capacity.
 *
 * Side effect: Calls the `get_global_storage_usage()` RPC to fetch current total usage.
 *
 * @param newFileSize - Size of the file being uploaded in bytes
 * @param oldFileSize - Size of the file being replaced in bytes (optional, default 0)
 * @returns Promise resolving to `{ ok: true }` on success or `{ ok: false, error: string }` on quota violation
 *
 * @see {@link validateUserStorageLimit} for per-user quota validation
 * @see {@link FILE_LIMITS} for the 50GB global limit in bytes
 *
 * @author Maruf Bepary
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
