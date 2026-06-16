import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Retrieves the total storage usage for a specific user.
 * @param userId - The ID of the user.
 * @returns {Promise<number>} User's storage usage in bytes.
 */
export async function getUserStorageUsage(userId: string): Promise<number> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_user_storage_usage", {
    p_user_id: userId,
  });

  if (error) {
    console.error(`Error fetching storage usage for user ${userId}:`, error);
    return 0;
  }

  return Number(data ?? 0);
}
