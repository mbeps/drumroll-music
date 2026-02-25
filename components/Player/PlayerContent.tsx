"use client";

import { useEffect, useState } from "react";
import useSound from "use-sound";
import usePlayer from "@/hooks/usePlayer";
import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types/types";
import PlayerControls from "./PlayerControls";
import PlayerVolume from "./PlayerVolume";
import CoverArt from "./CoverArt";
import SongInfo from "./SongInfo";
import LikeButton from "../LikeButton";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const imageUrl = useLoadImage(song) || "/images/liked.png";

  // ── Playlist navigation ──────────────────────────────────────────────

  const onPlayNext = () => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  };

  // ── Audio (use-sound) ────────────────────────────────────────────────

  const [play, { pause, sound }] = useSound(songUrl, {
    volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"],
  });

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
    setVolume((prev) => (prev === 0 ? 1 : 0));
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <>
      {/* ─── Mobile layout (below md) ─────────────────────────────────── */}
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <button type="button" className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 h-16 w-full text-left cursor-pointer">
              <div className="flex items-center justify-between p-2 w-full">
                {/* Left: cover + song info */}
                <div className="flex items-center gap-x-3 min-w-0">
                  <CoverArt src={imageUrl} alt={song.title || "Cover"} size="sm" />
                  <SongInfo title={song.title} author={song.author} size="sm" />
                </div>

                {/* Right: playback controls (stop propagation to prevent drawer open) */}
                <div
                  className="flex items-center shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <PlayerControls
                    isPlaying={isPlaying}
                    onPlayPause={handlePlay}
                    onNext={onPlayNext}
                    onPrevious={onPlayPrevious}
                    size="sm"
                  />
                </div>
              </div>
            </button>
          </DrawerTrigger>

          <DrawerContent className="h-[96vh] max-h-[96vh]">
            <div className="flex flex-col items-center justify-between h-full px-6 py-8">
              {/* Large cover art */}
              <CoverArt src={imageUrl} alt={song.title || "Cover"} size="lg" />

              {/* Song info */}
              <DrawerHeader className="w-full text-center">
                <DrawerTitle className="text-2xl font-bold truncate">
                  {song.title}
                </DrawerTitle>
                <DrawerDescription className="text-lg text-muted-foreground truncate">
                  {song.author}
                </DrawerDescription>
              </DrawerHeader>

              {/* Controls */}
              <div className="w-full space-y-6">
                <PlayerControls
                  isPlaying={isPlaying}
                  onPlayPause={handlePlay}
                  onNext={onPlayNext}
                  onPrevious={onPlayPrevious}
                  size="lg"
                />
                <PlayerVolume
                  volume={volume}
                  onChangeVolume={handleVolumeChange}
                  toggleMute={handleMute}
                />
              </div>

              {/* Like button */}
              <DrawerFooter className="w-full items-center">
                <LikeButton songId={song.id} />
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* ─── Tablet layout (md to lg) ─────────────────────────────────── */}
      <div className="hidden md:block lg:hidden">
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 h-20 px-4">
          <div className="grid grid-cols-3 h-full w-full items-center">
            {/* Left: cover + info + like */}
            <div className="flex items-center gap-x-3 min-w-0">
              <CoverArt src={imageUrl} alt={song.title || "Cover"} size="sm" />
              <SongInfo title={song.title} author={song.author} size="sm" />
              <LikeButton songId={song.id} />
            </div>

            {/* Center: playback controls */}
            <div className="flex justify-center">
              <PlayerControls
                isPlaying={isPlaying}
                onPlayPause={handlePlay}
                onNext={onPlayNext}
                onPrevious={onPlayPrevious}
                size="default"
              />
            </div>

            {/* Right: volume */}
            <div className="flex justify-end">
              <div className="w-36">
                <PlayerVolume
                  volume={volume}
                  onChangeVolume={handleVolumeChange}
                  toggleMute={handleMute}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Desktop layout (lg+) ─────────────────────────────────────── */}
      <div className="hidden lg:flex fixed right-0 top-0 h-full w-80 bg-background border-l border-border flex-col shadow-xl z-50">
        {/* Top section: cover + info + like */}
        <div className="p-6 flex flex-col items-center space-y-6 flex-1 overflow-y-auto">
          <CoverArt src={imageUrl} alt={song.title || "Cover"} size="lg" />

          <SongInfo title={song.title} author={song.author} size="lg" />

          <LikeButton songId={song.id} />
        </div>

        {/* Bottom section: controls + volume */}
        <div className="p-6 border-t border-border space-y-4">
          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={handlePlay}
            onNext={onPlayNext}
            onPrevious={onPlayPrevious}
            size="default"
          />
          <PlayerVolume
            volume={volume}
            onChangeVolume={handleVolumeChange}
            toggleMute={handleMute}
          />
        </div>
      </div>
    </>
  );
};

export default PlayerContent;
