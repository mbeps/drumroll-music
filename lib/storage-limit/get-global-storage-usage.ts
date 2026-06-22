/**
 * Fetches global application storage usage via Supabase RPC.
 *
 * Calls the `get_global_storage_usage()` SQL RPC to retrieve the total size
 * of all storage objects in the application regardless of owner. Used by storage
 * validation functions to enforce the 50GB global quota.
 *
 * Side effect: Server-side RPC call to Supabase. Handles errors gracefully by
 * returning 0 to allow operations to proceed if RPC fails.
 *
 * @author Maruf Bepary
 */

import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Retrieves the total global storage usage for the entire application.
 *
 * Executes the `get_global_storage_usage()` server function which sums the
 * size of all storage.objects across all users. Returns 0 if the RPC fails
 * to avoid blocking operations on transient errors.
 *
 * Side effect: Calls server-side RPC to Supabase database.
 *
 * @returns Promise resolving to total application storage usage in bytes (0 on error)
 *
 * @see {@link validateGlobalStorageLimit} for usage context
 * @see {@link FILE_LIMITS.GLOBAL_STORAGE_LIMIT_BYTES} for the 50GB global limit
 *
 * @author Maruf Bepary
 */
export async function getGlobalStorageUsage(): Promise<number> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_global_storage_usage");

  if (error) {
    console.error("Error fetching global storage usage:", error);
    return 0;
  }

  return Number(data ?? 0);
}
