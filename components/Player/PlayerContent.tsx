"use client";

import { useEffect, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import useSound from "use-sound";

import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types/types";
import LikeButton from "../LinkButton";
import MediaItem from "../MediaItem";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const PlayPauseIcon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  };

  // player
  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
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

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const handleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem song={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>

      {/* Mobile Player Controls */}
      <div
        className="
            flex 
            md:hidden 
            col-auto 
            w-full 
            justify-end 
            items-center
          "
      >
        <div
          onClick={handlePlay}
          className="
              h-10
              w-10
              flex 
              items-center 
              justify-center 
              rounded-lg 
              bg-red-500 
              p-1 
              cursor-pointer
            "
        >
          <PlayPauseIcon size={30} className="text-black" />
        </div>
      </div>

      {/* Desktop Player Controls */}
      <div
        className="
            hidden
            h-full
            md:flex 
            justify-center 
            items-center 
            w-full 
            max-w-[722px] 
            gap-x-6
          "
      >
        <AiFillStepBackward
          onClick={onPlayPrevious}
          size={26}
          className="
              text-neutral-400 
              cursor-pointer 
              hover:text-red-300
              transition
            "
        />
        <div
          onClick={handlePlay}
          className="
              flex 
              items-center 
              justify-center
              h-10
              w-10 
              rounded-lg 
              bg-red-500 
							hover:bg-red-300 
							transition
              p-1 
              cursor-pointer
            "
        >
          <PlayPauseIcon size={30} className="text-black" />
        </div>
        <AiFillStepForward
          onClick={onPlayNext}
          size={26}
          className="
              text-neutral-400 
              cursor-pointer 
              hover:text-red-300
              transition
            "
        />
      </div>

      {/* Hidden on Mobile */}
      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={handleMute}
            className="
						text-neutral-400 
						cursor-pointer 
						hover:text-red-300
						transition
						"
            size={24}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
