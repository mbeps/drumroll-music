import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Retrieves the total global storage usage by calling the get_global_storage_usage RPC.
 * @returns {Promise<number>} Total storage usage in bytes.
 */
export async function getGlobalStorageUsage(): Promise<number> {
  const supabase = await createServerSupabaseClient();
  // @ts-expect-error - RPC might not be in generated types
  const { data, error } = await supabase.rpc("get_global_storage_usage");

  if (error) {
    console.error("Error fetching global storage usage:", error);
    return 0;
  }

  return Number(data ?? 0);
}
