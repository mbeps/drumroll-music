import type { UserDetails } from "@/types/user-details";
import type { Database } from "@/types/types_db";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

/**
 * Transforms a raw database users row into a domain UserDetails object.
 * Use this wherever a public.users row needs to be mapped to frontend types.
 * Decouples the frontend from Supabase's internal snake_case column names.
 *
 * @param row - The raw user record from the database.
 * @returns A structured UserDetails object with camelCase properties.
 * @author Maruf Bepary
 */
export const mapUserRow = (row: UserRow): UserDetails => ({
  id: row.id,
  full_name: row.full_name,
  avatar_url: row.avatar_url,
  createdAt: row.created_at,
});
