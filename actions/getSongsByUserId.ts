import { Song } from "@/types/types";
import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Fetches all songs that have been created by the currently authenticated user.
 *
 * @returns (Song[]): promises an array of songs
 */
const getSongsByUserId = async (): Promise<Song[]> => {
  const supabase = await createServerSupabaseClient(); // server component supabase client

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(); // authenticate and get current user

  // if no user or error, return an empty array of songs
  if (error || !user) {
    if (error) console.log(error.message);
    return [];
  }

  // fetching all songs that match the current user's ID
  const { data, error: queryError } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (queryError) {
    console.log(queryError.message);
  }

  return (data as Song[]) || [];
};

export default getSongsByUserId;
