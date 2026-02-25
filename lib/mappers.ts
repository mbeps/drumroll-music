import { Song } from "@/types/types";
import { Database } from "@/types/types_db";

type SongRow = Database["public"]["Tables"]["songs"]["Row"];

/**
 * Maps a raw Supabase songs row to the domain Song type.
 *
 * @param row - Raw row returned by Supabase from the songs table
 * @returns Song
 */
export const mapSongRow = (row: SongRow): Song => ({
  id: row.id,
  user_id: row.user_id,
  author: row.author,
  title: row.title,
  song_path: row.song_path,
  image_path: row.image_path,
});
