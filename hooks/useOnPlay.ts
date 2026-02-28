"use client";

import type { SongWithAlbum, OnPlayFn } from "@/types/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";

/**
 * Returns a callback that starts playback for a song from the given list.
 * Opens the auth modal if the user is not signed in.
 *
 * @param songs - songs available for playback in the current view
 * @returns play handler accepting a song id
 */
const useOnPlay = (songs: SongWithAlbum[]): OnPlayFn => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const { user } = useUser();

  const onPlay: OnPlayFn = (id) => {
    if (!user) return authModal.onOpen();

    player.setId(id);
    player.setIds(songs.map((song) => song.id));
  };

  return onPlay;
};

export default useOnPlay;
