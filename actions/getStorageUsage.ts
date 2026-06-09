"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { FILE_LIMITS } from "@/lib/env";

/**
 * Result of the storage usage fetch.
 */
export interface StorageUsageResult {
  /** Total bytes used in the application. */
  usage: number;
  /** Global application capacity in bytes. */
  limit: number;
}

/**
 * Fetches the current global storage usage from the database using the
 * `get_global_storage_usage` RPC function.
 *
 * @returns {Promise<StorageUsageResult>} An object containing the current usage and limit.
 */
export async function getStorageUsage(): Promise<StorageUsageResult> {
  const supabase = await createServerSupabaseClient();

  // @ts-expect-error - Supabase types might not be updated with the new RPC yet
  const { data, error } = await supabase.rpc("get_global_storage_usage");

  if (error) {
    console.error("Error fetching global storage usage:", error);
    return { usage: 0, limit: FILE_LIMITS.GLOBAL_STORAGE_LIMIT_BYTES };
  }

  return {
    usage: Number(data),
    limit: FILE_LIMITS.GLOBAL_STORAGE_LIMIT_BYTES,
  };
}
