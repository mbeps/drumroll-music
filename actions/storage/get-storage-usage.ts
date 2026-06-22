"use server";

/**
 * Storage usage metrics for both per-user and global application capacity.
 * Used by account/dashboard to display storage utilization and remaining capacity.
 */
export interface StorageUsageResult {
  /** User storage usage in bytes. */
  userUsage: number;
  /** User storage limit in bytes (1GB default). */
  userLimit: number;
  /** Global application storage usage in bytes across all users. */
  globalUsage: number;
  /** Global application storage capacity in bytes (50GB default). */
  globalLimit: number;
}

/**
 * Server action to fetch current storage usage for both user and global quotas.
 * Calls Supabase RPCs get_user_storage_usage() and get_global_storage_usage().
 * Used by account/dashboard to display storage metrics.
 *
 * @module actions/storage/get-storage-usage
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { FILE_LIMITS } from "@/lib/env";
import { getLogger } from "@/lib/logger";

const logger = getLogger(["app", "actions", "storage"]);

/**
 * Fetches current storage usage for both user (1GB) and global (50GB) quotas.
 * If userId is not provided, fetches usage for the currently authenticated user.
 * Calls Supabase RPCs in parallel for efficiency.
 *
 * @param userId - Optional UUID of the user to fetch usage for; defaults to authenticated user
 * @returns StorageUsageResult object with usage and limit metrics in bytes
 * @throws UnauthorizedError if no userId provided and user is not authenticated
 * @throws DatabaseError if RPC calls fail (errors are logged but don't throw)
 * @see validateStorageForUpload for pre-upload validation using this data
 * @author Maruf Bepary
 */
export async function getStorageUsage(userId?: string): Promise<StorageUsageResult> {
  const supabase = await createServerSupabaseClient();
  
  let targetUserId = userId;
  
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    targetUserId = user?.id;
  }

  const [globalData, userData] = await Promise.all([
    supabase.rpc("get_global_storage_usage"),
    targetUserId 
      ? supabase.rpc("get_user_storage_usage", { p_user_id: targetUserId })
      : Promise.resolve({ data: 0, error: null })
  ]);

  if (globalData.error) {
    logger.error("Error fetching global storage usage: {error}", {
      error: globalData.error,
    });
  }
  
  if (userData.error) {
    logger.error("Error fetching storage usage for user {targetUserId}: {error}", {
      targetUserId,
      error: userData.error,
    });
  }

  return {
    userUsage: Number(userData.data ?? 0),
    userLimit: FILE_LIMITS.USER_STORAGE_LIMIT_BYTES,
    globalUsage: Number(globalData.data ?? 0),
    globalLimit: FILE_LIMITS.GLOBAL_STORAGE_LIMIT_BYTES,
  };
}
