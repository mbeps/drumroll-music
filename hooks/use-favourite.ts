"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSessionContext } from "@/providers/supabase-provider";
import { useUser } from "@/hooks/use-user";
import useAuthModal from "@/hooks/use-auth-modal";

/**
 * @fileoverview Manages favorite status and operations for a song.
 * Tracks whether a song is in the user's favorites playlist and provides toggle functionality.
 * @author Maruf Bepary
 */

/**
 * Manages favorite status for a song and provides a toggle function.
 * Checks if a song is in the user's "Favourites" playlist and provides a method to add or remove it.
 * Creates the "Favourites" playlist automatically if it does not exist.
 *
 * @param songId - The ID of the song to track and manage in favorites.
 * @returns Object containing favorite state and toggle method.
 *   - isFavourite: Boolean indicating if the song is in the user's favorites
 *   - toggleFavourite: Async function to add/remove the song from favorites
 * @see useAddToPlaylist for adding songs to custom playlists
 * @author Maruf Bepary
 */
const useFavourite = (songId: number) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const authModal = useAuthModal();
  const [isFavourite, setIsFavourite] = useState(false);
  const [playlistId, setPlaylistId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let isCancelled = false;

    const checkFavourite = async () => {
      const { data: playlist } = await supabaseClient
        .from("playlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_favourites", true)
        .maybeSingle();

      if (isCancelled) return;

      if (!playlist) {
        setPlaylistId(null);
        setIsFavourite(false);
        return;
      }

      setPlaylistId(playlist.id);

      const { data: entry } = await supabaseClient
        .from("playlist_songs")
        .select("song_id")
        .eq("playlist_id", playlist.id)
        .eq("song_id", songId)
        .maybeSingle();

      if (isCancelled) return;

      setIsFavourite(!!entry);
    };

    checkFavourite();

    return () => {
      isCancelled = true;
    };
  }, [songId, user, supabaseClient]);

  const toggleFavourite = async () => {
    if (!user) return authModal.onOpen();

    let currentPlaylistId = playlistId;

    // Create favourites playlist if it doesn't exist
    if (!currentPlaylistId) {
      const { data: newPlaylist, error: createError } = await supabaseClient
        .from("playlists")
        .insert({
          user_id: user.id,
          title: "Favourites",
          is_favourites: true,
        })
        .select("id")
        .single();

      if (createError || !newPlaylist) {
        toast.error("Failed to create favourites playlist");
        return;
      }

      currentPlaylistId = newPlaylist.id;
      setPlaylistId(currentPlaylistId);
    }

    if (isFavourite) {
      const { error } = await supabaseClient
        .from("playlist_songs")
        .delete()
        .eq("playlist_id", currentPlaylistId)
        .eq("song_id", songId);

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsFavourite(false);
    } else {
      const { data: maxPos } = await supabaseClient
        .from("playlist_songs")
        .select("position")
        .eq("playlist_id", currentPlaylistId)
        .order("position", { ascending: false })
        .limit(1)
        .single();

      const nextPosition = (maxPos?.position ?? 0) + 1;

      const { error } = await supabaseClient
        .from("playlist_songs")
        .insert({
          playlist_id: currentPlaylistId,
          song_id: songId,
          position: nextPosition,
        });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsFavourite(true);
    }

    router.refresh();
  };

  return { isFavourite, toggleFavourite };
};

export default useFavourite;
