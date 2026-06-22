/**
 * Server action to validate if an upload is allowed under both user and global storage limits.
 * Called from client before initiating upload; performs dual-limit validation server-side.
 * Returns OK or descriptive error for limit exceeded scenarios.
 *
 * @module actions/storage/validate-storage-for-upload
 * @author Maruf Bepary
 */
"use server";

import { getLogger } from "@/lib/logger";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { validateStorageLimits } from "@/lib/storage-limit/validate-storage-limits";

const logger = getLogger(["app", "actions", "storage"]);

/**
 * Validates if the proposed upload is allowed under both user (1GB) and global (50GB) storage limits.
 * Called from client before initiating upload; performs server-side validation.
 * Supports file replacements by accepting oldFileSize to calculate net storage impact.
 *
 * @param newFileSize - Size of the file to be uploaded in bytes
 * @param oldFileSize - Size of the file being replaced in bytes; defaults to 0 (new upload)
 * @returns Object with `ok: true` if upload is allowed, or `ok: false` with descriptive `error` on limit exceeded
 * @throws UnauthorizedError if user is not authenticated
 * @throws StorageLimitError if either user or global quota would be exceeded
 * @see validateStorageLimits for the underlying dual-limit validation logic
 * @author Maruf Bepary
 */
export async function validateStorageForUpload(
  newFileSize: number,
  oldFileSize: number = 0
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("Storage validation failed: User not authenticated");
    return { ok: false, error: "Authenticated user not found. Please log in again." };
  }

  logger.debug("Validating storage limits for user: {userId}, newSize: {newSize}, oldSize: {oldSize}", {
    userId: user.id,
    newSize: newFileSize,
    oldSize: oldFileSize,
  });

  const result = await validateStorageLimits(newFileSize, user.id, oldFileSize);

  if (!result.ok) {
    logger.warn("Storage validation failed for user {userId}: {error}", {
      userId: user.id,
      error: result.error,
    });
  } else {
    logger.info("Storage validation passed for user: {userId}", { userId: user.id });
  }

  return result;
}
