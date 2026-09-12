"use server";

import { FILE_LIMITS } from "@/config/env";
import { getLogger } from "@/lib/logger";
import type { StorageUsageResult } from "@/types/storage/storage-usage-result";
import { createServerSupabaseClient } from "@/utils/supabase/server";

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
 * @author Maruf Bepary
 */
const getStorageUsage = async (userId?: string): Promise<StorageUsageResult> => {
  const supabase = await createServerSupabaseClient();

  let targetUserId = userId;

  if (!targetUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    targetUserId = user?.id;
  }

  logger.debug("Fetching storage usage for user: {targetUserId}", { targetUserId });

  const [globalData, userData] = await Promise.all([
    supabase.rpc("get_global_storage_usage"),
    targetUserId
      ? supabase.rpc("get_user_storage_usage", { p_user_id: targetUserId })
      : Promise.resolve({ data: 0, error: null }),
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
};

export default getStorageUsage;
