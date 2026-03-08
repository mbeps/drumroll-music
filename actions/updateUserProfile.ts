"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { UpdateProfileSchema } from "@/schemas/user/update-profile.schema";

/**
 * Server action. Updates the display name of the currently authenticated user.
 * Validates input with Zod before writing to `public.users`. Revalidates `/account` on success.
 *
 * @param input - Object containing the new full name to set.
 * @returns true on success, false otherwise.
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

  revalidatePath("/account");
  return true;
};

export default updateUserProfile;
