import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Song } from "@/types/types";

import getSongs from "./getSongs";

/**
 * Responsible for retrieving all songs that match the title.
 *
 * @param title (string): the title of the song to be searched
 * @returns (Song[]): promises an array of songs that match the title
 */
const getSongsByTitle = async (title: string): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

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
