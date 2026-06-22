"use client";

import usePlayer from "@/hooks/use-player";
import useGetSongById from "@/hooks/use-get-song-by-id";
import useLoadSongUrl from "@/hooks/use-load-song-url";
import PlayerContent from "./player-content";

/**
 * Root container for the global playback system.
 * Orchestrates loading of active song metadata and audio streams from Supabase Storage.
 * Delegates UI rendering to PlayerContent while ensuring safe conditional rendering.
 *
 * @author Maruf Bepary
 */
const Player = () => {
  const player = usePlayer();
  // Use the song already in the store to avoid an unnecessary Supabase fetch.
  // Fall back to a DB fetch only when the active song is not in the store
  // (e.g. the very first play triggered by useOnPlay before setSongs runs).
  const songFromStore = player.songs.find((s) => s.id === player.activeId);
  const { song: songFromDb } = useGetSongById(songFromStore ? undefined : player.activeId);
  const song = songFromStore ?? songFromDb;
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
