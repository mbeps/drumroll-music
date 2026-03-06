"use client";

import type { Song } from "../types/song";
import { useSupabaseClient } from "@/providers/SupabaseProvider";

/**
 * Resolves a Supabase Storage public URL for a song's audio file.
 *
 * @param song - song whose audio URL to resolve
 * @returns public URL string, or empty string if song is unavailable
 */
const useLoadSongUrl = (song: Song | undefined): string => {
  const supabaseClient = useSupabaseClient();

  if (!song?.songPath) return "";

  const { data } = supabaseClient.storage
    .from("songs")
    .getPublicUrl(song.songPath);

  return data.publicUrl;
};

export default useLoadSongUrl;
