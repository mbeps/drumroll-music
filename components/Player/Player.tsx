"use client";

import usePlayer from "@/hooks/usePlayer";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import PlayerContent from "./PlayerContent";

const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId); // song to be played

  const songUrl = useLoadSongUrl(song!); // fetch song to be played

  // player not visible
  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return (
    <div
      className="
        fixed 
        bottom-0 
        bg-black 
        w-full 
        py-2 
        h-[80px] 
        px-4
      "
    >
      {/* key passed for each song so that player is re-rendered */}
      <PlayerContent key={songUrl} song={song} songUrl={songUrl} />
    </div>
  );
};

export default Player;
