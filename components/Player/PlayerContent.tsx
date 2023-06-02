"use client";

import { useEffect, useState } from "react";
import useSound from "use-sound";

import { Song } from "@/types/types";
import LikeButton from "../LinkButton";
import MediaItem from "../MediaItem";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // player
  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"],
  });

  // automatically play song when player component is loaded
  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    };
  }, [sound]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem song={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
