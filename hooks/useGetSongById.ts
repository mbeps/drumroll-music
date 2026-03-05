"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { SongWithAlbum } from "../types/song-with-album";
import { useSessionContext } from "@/providers/SupabaseProvider";
import { mapSongWithAlbumRow } from "@/lib/mappers";
import { SONG_WITH_ALBUM_SELECT } from "@/actions/_selects";

/**
 * Fetches a song with its album and artists by id.
 *
 * @param id - song id to fetch
 * @returns song (with album/artists) and loading state
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
