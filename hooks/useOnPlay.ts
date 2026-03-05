"use client";

import type { OnPlayFn } from "../types/on-play-fn";
import type { SongWithAlbum } from "../types/song-with-album";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";

/**
 * Returns a callback that starts playback for a song from the given list.
 * Opens the auth modal if the user is not signed in.
 * Sets the active song ID and populates the player queue with the provided list.
 *
 * @param songs - List of songs available for playback in the current context
 * @returns An onPlay function that accepts a song ID to begin playback
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
