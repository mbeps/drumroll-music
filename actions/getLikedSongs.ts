import { Song } from "@/types/types";
import { LikedSongRow } from "@/types/types_db";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { mapSongRow } from "@/lib/mappers";

/**
 * Responsible for retrieving all songs liked by the currently authenticated user.
 * It first authenticates the current user,
 * then fetches all records from the "liked_songs" table that match the current user's ID.
 * It orders the songs based on the "created_at" field in descending order.
 * The return value is an array of liked songs.
 *
 * @returns (Song[]): promises an array of liked songs
 */
const getLikedSongs = async (): Promise<Song[]> => {
  const supabase = await createServerSupabaseClient(); // server component supabase client

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(); // authenticate and get current user

  if (error || !user) {
    if (error) console.log(error.message);
    return [];
  }

  const { data } = await supabase
    .from("liked_songs")
    .select("*, songs(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<LikedSongRow[]>(); // fetching all liked songs

  if (!data) return []; // if no data, return an empty array of songs

  return data
    .flatMap((item) => (item.songs ? [mapSongRow(item.songs)] : [])); // map to domain Song type
};

export default getLikedSongs;
