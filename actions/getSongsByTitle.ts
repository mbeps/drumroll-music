import { Song } from "@/types/types";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import getSongs from "./getSongs";

/**
 * Responsible for retrieving all songs that match the title.
 *
 * @param title (string): the title of the song to be searched
 * @returns (Song[]): promises an array of songs that match the title
 */
const getSongsByTitle = async (title: string): Promise<Song[]> => {
  const supabase = await createServerSupabaseClient();

  // if no title matches, return all songs
  if (!title) {
    const allSongs = await getSongs();
    return allSongs;
  }

  // fetching all songs that match the title
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as Song[]) || [];
};

export default getSongsByTitle;
