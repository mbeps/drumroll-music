import { validateUserStorageLimit } from "./validate-user-storage-limit";
import { validateGlobalStorageLimit } from "./validate-global-storage-limit";

/**
 * Validates both global and per-user storage limits.
 * @param newFileSize - The size of the file to be uploaded in bytes.
 * @param userId - The ID of the user.
 * @param oldFileSize - The size of the file being replaced in bytes (optional).
 * @returns {Promise<{ ok: boolean, error?: string }>} Validation result.
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
