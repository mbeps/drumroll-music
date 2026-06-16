"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { FILE_LIMITS } from "@/lib/env";

/**
 * Result of the storage usage fetch.
 */
export interface StorageUsageResult {
  /** User storage usage in bytes. */
  userUsage: number;
  /** User storage limit in bytes. */
  userLimit: number;
  /** Global application storage usage in bytes. */
  globalUsage: number;
  /** Global application capacity in bytes. */
  globalLimit: number;
}

/**
 * Fetches the current storage usage (both user-specific and global) from the database.
 * If no userId is provided, it tries to fetch usage for the currently authenticated user.
 *
 * @param userId - Optional ID of the user to fetch usage for.
 * @returns {Promise<StorageUsageResult>} An object containing user and global usage/limits.
 */
export async function getStorageUsage(userId?: string): Promise<StorageUsageResult> {
  const supabase = await createServerSupabaseClient();
  
  let targetUserId = userId;
  
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    targetUserId = user?.id;
  }

  const [globalData, userData] = await Promise.all([
    // @ts-expect-error - RPC might not be in generated types
    supabase.rpc("get_global_storage_usage"),
    targetUserId 
      ? // @ts-expect-error - RPC might not be in generated types
        supabase.rpc("get_user_storage_usage", { p_user_id: targetUserId })
      : Promise.resolve({ data: 0, error: null })
  ]);

  if (globalData.error) {
    console.error("Error fetching global storage usage:", globalData.error);
  }
  
  if (userData.error) {
    console.error(`Error fetching storage usage for user ${targetUserId}:`, userData.error);
  }

  return {
    userUsage: Number(userData.data ?? 0),
    userLimit: FILE_LIMITS.USER_STORAGE_LIMIT_BYTES,
    globalUsage: Number(globalData.data ?? 0),
    globalLimit: FILE_LIMITS.GLOBAL_STORAGE_LIMIT_BYTES,
  };
}
