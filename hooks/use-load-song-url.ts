/**
 * @fileoverview Generates Supabase Storage public URLs for song audio files.
 * Converts internal storage paths to publicly accessible HTTP URLs.
 * @author Maruf Bepary
 */

"use client";

import type { Song } from "../types/song/song";
import { useSupabaseClient } from "@/providers/supabase-provider";

/**
 * Resolves a public Supabase Storage URL for a song's audio file.
 * Returns an empty string if the song or song path is not available.
 *
 * @param song - The song object containing the storage path to resolve.
 * @returns The public URL string for the song's audio file, or empty string if unavailable.
 * @see useLoadImage for resolving image URLs
 * @author Maruf Bepary
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
