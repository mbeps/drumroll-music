"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSessionContext } from "@/providers/SupabaseProvider";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import type { Playlist } from "@/types/types";

/**
 * Manages adding a song to playlists.
 * Loads the user's non-favourites playlists and tracks which ones already contain the song.
 *
 * @param songId - id of the song to add
 */
const useAddToPlaylist = (songId: number) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const authModal = useAuthModal();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistSongIds, setPlaylistSongIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    let isCancelled = false;

    const fetchData = async () => {
      setIsLoading(true);

      const { data: playlistData } = await supabaseClient
        .from("playlists")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_favourites", false)
        .order("created_at", { ascending: false });

      if (isCancelled) return;

      const mapped: Playlist[] = (playlistData ?? []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        isFavourites: row.is_favourites,
        createdAt: row.created_at,
      }));

      setPlaylists(mapped);

      if (mapped.length > 0) {
        const playlistIds = mapped.map((p) => p.id);

        const { data: songEntries } = await supabaseClient
          .from("playlist_songs")
          .select("playlist_id")
          .eq("song_id", songId)
          .in("playlist_id", playlistIds);

        if (isCancelled) return;

        setPlaylistSongIds((songEntries ?? []).map((e) => e.playlist_id));
      }

      setIsLoading(false);
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [songId, user, supabaseClient]);

  const addToPlaylist = async (playlistId: string) => {
    if (!user) return authModal.onOpen();

    if (playlistSongIds.includes(playlistId)) {
      toast.info("Song already in playlist");
      return;
    }

    const { data: maxPos } = await supabaseClient
      .from("playlist_songs")
      .select("position")
      .eq("playlist_id", playlistId)
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const nextPosition = (maxPos?.position ?? 0) + 1;

    const { error } = await supabaseClient
      .from("playlist_songs")
      .insert({ playlist_id: playlistId, song_id: songId, position: nextPosition });

    if (error) {
      toast.error("Failed to add song to playlist");
      return;
    }

    setPlaylistSongIds((prev) => [...prev, playlistId]);
    toast.success("Added to playlist");
    router.refresh();
  };

  const createAndAdd = async (title: string) => {
    if (!user) return authModal.onOpen();

    const { data: newPlaylist, error: createError } = await supabaseClient
      .from("playlists")
      .insert({ user_id: user.id, title, is_favourites: false })
      .select("*")
      .single();

    if (createError || !newPlaylist) {
      toast.error("Failed to create playlist");
      return;
    }

    const { error: insertError } = await supabaseClient
      .from("playlist_songs")
      .insert({ playlist_id: newPlaylist.id, song_id: songId, position: 1 });

    if (insertError) {
      toast.error("Failed to add song to playlist");
      return;
    }

    const mapped: Playlist = {
      id: newPlaylist.id,
      userId: newPlaylist.user_id,
      title: newPlaylist.title,
      isFavourites: newPlaylist.is_favourites,
      createdAt: newPlaylist.created_at,
    };

    setPlaylists((prev) => [mapped, ...prev]);
    setPlaylistSongIds((prev) => [...prev, newPlaylist.id]);
    toast.success("Created playlist and added song");
    router.refresh();
  };

  const isInPlaylist = (playlistId: string) =>
    playlistSongIds.includes(playlistId);

  return { playlists, isLoading, addToPlaylist, createAndAdd, isInPlaylist };
};

export default useAddToPlaylist;
