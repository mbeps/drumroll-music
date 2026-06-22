/**
 * Dual storage quota validation combining per-user and global limits.
 *
 * This module exports the main public API for validating file operations
 * against both storage constraints. Enforces the per-user limit (1GB) first,
 * then the global limit (50GB), short-circuiting on the first failure.
 * Handles file replacements correctly by computing net impact.
 *
 * @see {@link validateUserStorageLimit} for per-user quota logic
 * @see {@link validateGlobalStorageLimit} for global quota logic
 * @author Maruf Bepary
 */

import { validateUserStorageLimit } from "./validate-user-storage-limit";
import { validateGlobalStorageLimit } from "./validate-global-storage-limit";

/**
 * Validates a file operation against both per-user (1GB) and global (50GB) storage quotas.
 *
 * Checks user quota first, then global quota. Returns on first failure.
 * For file replacements, computes the net impact (newFileSize - oldFileSize)
 * to determine the true storage increase. Typical usage: before uploading a new file
 * or replacing an existing file (e.g., re-uploading a song or updating an avatar).
 *
 * @param newFileSize - Size of the file being uploaded in bytes
 * @param userId - ID of the user uploading the file
 * @param oldFileSize - Size of the file being replaced in bytes (optional, default 0)
 * @returns Promise resolving to `{ ok: true }` on success or `{ ok: false, error: string }` on quota violation
 *
 * @throws Does not throw; returns error object on validation failure
 *
 * @see {@link validateUserStorageLimit} for user-level quota validation
 * @see {@link validateGlobalStorageLimit} for global quota validation
 *
 * @author Maruf Bepary
 */
export async function validateStorageLimits(
  newFileSize: number,
  userId: string,
  oldFileSize: number = 0
): Promise<{ ok: boolean; error?: string }> {
  const userCheck = await validateUserStorageLimit(newFileSize, userId, oldFileSize);
  if (!userCheck.ok) return userCheck;

  const globalCheck = await validateGlobalStorageLimit(newFileSize, oldFileSize);
  if (!globalCheck.ok) return globalCheck;

  return { ok: true };
}
