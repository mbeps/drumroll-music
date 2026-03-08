"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createServerSupabaseClient } from "@/utils/supabase/server";

const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
});

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
  const parsed = updateProfileSchema.safeParse(input);
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
