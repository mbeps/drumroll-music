/**
 * Server action to update the display name of the authenticated user.
 * Validates input with Zod before writing to public.users.
 * Revalidates the /account path on success.
 *
 * @module actions/user/update-user-profile
 * @author Maruf Bepary
 */
"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ROUTES } from "@/routes";
import { UpdateProfileSchema } from "@/schemas/user/update-profile.schema";

/**
 * Updates the display name (full_name) of the currently authenticated user.
 * Validates input with Zod before writing to `public.users`.
 * Revalidates `/account` on success to refresh the profile display.
 *
 * @param input - Object containing the new full name to set
 * @returns true on success, false on validation, authentication, or database error
 * @throws ValidationError if input fails Zod schema validation
 * @throws UnauthorizedError if user is not authenticated
 * @throws DatabaseError if database update fails
 * @see getUserProfile for fetching the current user's profile
 * @see uploadUserAvatar for uploading a profile avatar
 * @author Maruf Bepary
 */
const updateUserProfile = async (input: {
  fullName: string;
}): Promise<boolean> => {
  const parsed = UpdateProfileSchema.safeParse(input);
  if (!parsed.success) return false;

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from("users")
    .update({ full_name: parsed.data.fullName })
    .eq("id", user.id);

  if (error) return false;

  revalidatePath(ROUTES.ACCOUNT.path);
  return true;
};

export default updateUserProfile;
