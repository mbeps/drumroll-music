import { Song } from "@/types/types";
import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Fetches all songs that have been created by the currently authenticated user.
 *
 * @returns (Song[]): promises an array of songs
 */
const getSongsByUserId = async (): Promise<Song[]> => {
  const supabase = await createServerSupabaseClient(); // server component supabase client

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession(); // getting the current user session

  // if no session, return an empty array of songs
  if (sessionError) {
    console.log(sessionError.message);
    return [];
  }

  const userId = sessionData.session?.user.id;

  if (!userId) {
    return [];
  }

  // fetching all songs that match the current user's ID
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as Song[]) || [];
};

export default getSongsByUserId;
