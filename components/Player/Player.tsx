"use client";

import usePlayer from "@/hooks/usePlayer";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import PlayerContent from "./PlayerContent";

/**
 * Player component which allows the user to play songs.
 * The player is visible at the bottom of the screen when a song is playing.
 * There are several controls:
 * - play/pause button
 * - previous/next song buttons
 * - volume slider
 * - like button
 *
 * @returns (JSX.Element): player component
 */
const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId); // song to be played
  const songUrl = useLoadSongUrl(song); // fetch song to be played

  // player not visible if no song is playing
  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return (
    /* key passed for each song so that player is re-rendered */
    <PlayerContent key={songUrl} song={song} songUrl={songUrl} />
  );
};

export default Player;
