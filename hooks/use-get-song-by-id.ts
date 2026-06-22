/**
 * @fileoverview Fetches a song by ID with its album and artist metadata.
 * Loads full song details including album and artist information from the database.
 * @author Maruf Bepary
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { SongWithAlbum } from "../types/music/song-with-album";
import { useSessionContext } from "@/providers/supabase-provider";
import { mapSongWithAlbumRow } from "@/lib/mappers/song";
import { SONG_WITH_ALBUM_SELECT } from "@/actions/_db-selects";

/**
 * Fetches a song by ID with its album, artist, and metadata information.
 * Automatically refetches when the ID changes. Shows error toast if fetch fails.
 *
 * @param id - The song ID to fetch (optional; no fetch if undefined).
 * @returns Object containing the fetched song and loading state.
 *   - song: The SongWithAlbum object (undefined while loading or if not found)
 *   - isLoading: Boolean indicating if the song is being fetched
 * @author Maruf Bepary
 */
const useSongById = (id?: number): { isLoading: boolean; song: SongWithAlbum | undefined } => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<SongWithAlbum | undefined>(undefined);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) return;

    const fetchSong = async () => {
      setIsLoading(true);

      const { data, error } = await supabaseClient
        .from("songs")
        .select(SONG_WITH_ALBUM_SELECT)
        .eq("id", id)
        .single();

      if (error) {
        setIsLoading(false);
        console.log("ERROR: ", error.message);
        return toast.error("Could not play/fetch song(s)");
      }

      setSong(mapSongWithAlbumRow(data));
      setIsLoading(false);
    };

    fetchSong();
  }, [id, supabaseClient]);

  return useMemo(
    () => ({ isLoading, song }),
    [isLoading, song]
  );
};

export default useSongById;
