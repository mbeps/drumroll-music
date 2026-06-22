/**
 * Fetches per-user storage usage via Supabase RPC.
 *
 * Calls the `get_user_storage_usage()` SQL RPC to retrieve the total size
 * of all storage objects owned by a specific user. Used by storage validation
 * functions to enforce the 1GB per-user quota.
 *
 * Side effect: Server-side RPC call to Supabase. Handles errors gracefully by
 * returning 0 to allow operations to proceed if RPC fails.
 *
 * @author Maruf Bepary
 */

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { getLogger } from "@/lib/logger";

/**
 * Retrieves the total storage usage for a specific user.
 *
 * Executes the `get_user_storage_usage(p_user_id)` server function which
 * sums the size of all storage.objects where owner equals the user ID.
 * Returns 0 if the RPC fails to avoid blocking operations on transient errors.
 *
 * Side effect: Calls server-side RPC to Supabase database.
 *
 * @param userId - UUID of the user
 * @returns Promise resolving to user's total storage usage in bytes (0 on error)
 *
 * @see {@link validateUserStorageLimit} for usage context
 * @see {@link FILE_LIMITS.USER_STORAGE_LIMIT_BYTES} for the 1GB per-user limit
 *
 * @author Maruf Bepary
 */
export async function getUserStorageUsage(userId: string): Promise<number> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_user_storage_usage", {
    p_user_id: userId,
  });

  if (error) {
    const logger = getLogger(["app", "lib", "storage"]);
    logger.error("Error fetching storage usage for user {userId}: {error}", {
      userId,
      error,
    });
    return 0;
  }

  return Number(data ?? 0);
}
