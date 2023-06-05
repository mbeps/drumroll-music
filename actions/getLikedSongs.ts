import { Song } from "@/types/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * Responsible for retrieving all songs liked by the currently authenticated user.
 * It first gets the current user session,
 * then fetches all records from the "liked_songs" table that match the current user's ID.
 * It orders the songs based on the "created_at" field in descending order.
 * The return value is an array of liked songs.
 *
 * @returns (Song[]): promises an array of liked songs
 */
const getLikedSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies, // cookies from the incoming request
  }); // server component supabase client

  const {
    data: { session }, // destructuring session from the response
  } = await supabase.auth.getSession(); // getting the current user session

  const { data } = await supabase
    .from("liked_songs")
    .select("*, songs(*)")
    .eq("user_id", session?.user?.id)
    .order("created_at", { ascending: false }); // fetching all liked songs

  if (!data) return []; // if no data, return an empty array of songs

  return data.map((item) => ({
    ...item.songs, // spreading relation
  })); // return an array of songs
};

export default getLikedSongs;
