import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Song } from "@/types/types";

/**
 * Fetches all songs from the database in descending order.
 *
 * @returns (Song[]): promises an array of songs
 */
const getSongs = async (): Promise<Song[]> => {
  // server component supabase client
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

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
