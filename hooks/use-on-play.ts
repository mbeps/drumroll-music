"use client";

import type { OnPlayFn } from "../types/player/on-play-fn";
import type { SongWithAlbum } from "../types/music/song-with-album";
import usePlayer from "./use-player";
import useAuthModal from "./use-auth-modal";
import { useUser } from "./use-user";

/**
 * @fileoverview Standardized entry point for triggering song playback.
 * Checks authentication status before starting playback and sets up the queue.
 * @author Maruf Bepary
 */

/**
 * Returns a callback that starts playback for a song from the given list.
 * Prompts the user to sign in if not authenticated; otherwise, plays the song and sets the queue.
 *
 * @param songs - List of songs available for playback in the current context.
 * @returns A callback function that accepts a song ID to begin playback.
 * @see usePlayer for direct queue management
 * @author Maruf Bepary
 */
const useOnPlay = (songs: SongWithAlbum[]): OnPlayFn => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const { user } = useUser();

  const onPlay: OnPlayFn = (id) => {
    if (!user) return authModal.onOpen();

    player.setId(id);
    player.setIds(songs.map((song) => song.id));
    player.setSongs(songs);
  };

  return onPlay;
};

export default useOnPlay;
