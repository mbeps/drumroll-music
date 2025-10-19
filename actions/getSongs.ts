import { Song } from "@/types/types";
import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Fetches all songs from the database in descending order.
 *
 * @returns (Song[]): promises an array of songs
 */
const getSongs = async (): Promise<Song[]> => {
  // server component supabase client
  const supabase = await createServerSupabaseClient();

  // fetching all songs
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  // return an array of songs
  return (data as any) || [];
};

export default getSongs;
