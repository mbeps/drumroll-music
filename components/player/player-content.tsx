"use client";

import { Info, ListMusic, ListPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useLoadImage from "@/hooks/use-load-image";
import usePlayer from "@/hooks/use-player";
import { formatArtists } from "@/lib/music/format-artists";
import { cn } from "@/lib/utils";
import type { SongWithAlbum } from "../../types/music/song-with-album";
import FavouriteButton from "../favourite-button";
import CoverArt from "./cover-art";
import PlayerControls from "./player-controls";
import PlayerScrubber from "./player-scrubber";
import PlayerVolume from "./player-volume";
import PlaylistPanel from "./playlist-panel";
import QueuePanel from "./queue-panel";
import SongDetailsPanel from "./song-details-panel";
import SongInfo from "./song-info";

/**
 * Main player UI rendering active song, controls, and multi-panel interface.
 * Includes tabs for queue, playlists, and song details with full playback controls.
 * Responsive layout: compact bar on mobile, expanded panel on desktop.
 *
 * @author Maruf Bepary
 */

interface PlayerContentProps {
  /**
   * Complete metadata for the currently active song.
   */
  song: SongWithAlbum;
  /**
   * Direct URL for the audio source file.
   */
  songUrl: string;
}

/**
 * The core logic and UI engine for the global audio player.
 * Manages the high-level audio context using `use-sound`, provides playback synchronization
 * across the scrubber, volume, and control sub-components, and hosts the multi-tab
 * interface (Queue, Details, Playlist) for mobile and desktop views.
 *
 * @author Maruf Bepary
 * @param song The active song object being played.
 * @param songUrl The resolved storage URL for the audio file.
 */
const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"player" | "queue" | "playlist" | "details">("player");

  const imageUrl = useLoadImage(song.album.coverImagePath) || "/images/liked.png";

  // ── Playlist navigation ──────────────────────────────────────────────

  /**
   * Advance the active track to the next song in the queue.
   * Wraps to the first item when the end is reached.
   * No‑ops when the queue is empty.
   * @author Maruf Bepary
   */
  const onPlayNext = () => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  };

  /**
   * Move the active track to the previous song in the queue.
   * Wraps to the last item when at the beginning.
   * No‑ops when the queue is empty.
   * @author Maruf Bepary
   */
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

  // use-sound v5 registers all callbacks (onend, onplay, onpause) with the
  // Howl constructor exactly once — on mount via useOnMount([]) — and only
  // rebuilds the Howl when `src` changes. Every closure captured inside those
  // callbacks is therefore permanently stale after the first render.
  //
  // Two consequences that cause the "ONE" repeat-mode bug:
  //   1. `play` captured in onend has `sound === null` (sound is set
  //      asynchronously after Howler fires onload), so use-sound's internal
  //      `if (!sound) return` guard silently no-ops every call.
  //   2. `player.repeatMode` (and other Zustand state) is the snapshot from
  //      mount time, not the current value.
  //
  // Fix: keep a ref to the live Howler instance and call usePlayer.getState()
  // inside onend to always read fresh state at call time.
  const soundRef = useRef<ReturnType<typeof useSound>[1]["sound"]>(null);

  const [play, { pause, sound, duration }] = useSound(songUrl, {
    volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      // Read fresh Zustand state — avoids stale closure over `player` snapshot.
      const { repeatMode, ids, activeId, setId } = usePlayer.getState();

      if (repeatMode === "ONE") {
        // Call Howler directly via ref — avoids stale `play` wrapper which
        // captured `sound === null` at mount time and silently returns early.
        soundRef.current?.seek(0);
        soundRef.current?.play();
        return;
      }

      setIsPlaying(false);

      if (repeatMode === "OFF") {
        const currentIndex = ids.findIndex((id) => id === activeId);
        const isLastSong = currentIndex === ids.length - 1;

        if (isLastSong) {
          // Stay on this song and stop playback
          return;
        }
      }

      // "ALL" mode, or "OFF" mode with a next song: advance to next.
      const currentIndex = ids.findIndex((id) => id === activeId);
      const nextSong = ids[currentIndex + 1];
      setId(nextSong ?? ids[0]);
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"],
  });

  // Keep soundRef in sync so the stale onend closure always has the live Howl.
  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

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

  const handleStop = () => {
    player.reset();
  };

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <>
      {/* ─── Mobile layout (below md) ─────────────────────────────────── */}
      <div className="md:hidden">
        <Drawer onOpenChange={() => setActiveTab("player")}>
          <DrawerTrigger asChild>
            <button
              type="button"
              className="fixed right-0 bottom-16 left-0 z-50 h-16 w-full cursor-pointer border-border border-t bg-background text-left"
            >
              <div className="flex w-full items-center justify-between p-2">
                {/* Left: cover + song info */}
                <div className="flex min-w-0 items-center gap-x-3">
                  <CoverArt src={imageUrl} alt={song.title || "Cover"} size="sm" />
                  <SongInfo title={song.title} artists={song.album.artists} size="sm" />
                </div>

                {/* Right: playback controls (stop propagation to prevent drawer open) */}
                <div className="flex shrink-0 items-center" onClick={(e) => e.stopPropagation()}>
                  <PlayerControls
                    isPlaying={isPlaying}
                    onPlayPause={handlePlay}
                    onNext={onPlayNext}
                    onPrevious={onPlayPrevious}
                    repeatMode={player.repeatMode}
                    onToggleRepeat={player.toggleRepeatMode}
                    showRepeat={false}
                    size="sm"
                  />
                </div>
              </div>
            </button>
          </DrawerTrigger>

          <DrawerContent className="h-[96vh] max-h-[96vh]">
            {activeTab === "queue" ? (
              <div className="h-full">
                <QueuePanel onClose={() => setActiveTab("player")} />
              </div>
            ) : activeTab === "playlist" ? (
              <div className="h-full">
                <PlaylistPanel songId={song.id} onClose={() => setActiveTab("player")} />
              </div>
            ) : activeTab === "details" ? (
              <div className="h-full">
                <SongDetailsPanel
                  song={song}
                  imageUrl={imageUrl}
                  onClose={() => setActiveTab("player")}
                />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-between px-6 py-8">
                {/* Large cover art */}
                <CoverArt src={imageUrl} alt={song.title || "Cover"} size="lg" />

                {/* Song info */}
                <DrawerHeader className="w-full text-center">
                  <DrawerTitle className="truncate font-bold text-2xl">{song.title}</DrawerTitle>
                  <DrawerDescription className="truncate text-lg text-muted-foreground" asChild>
                    <div>{formatArtists(song.album)}</div>
                  </DrawerDescription>
                </DrawerHeader>

                {/* Controls */}
                <div className="w-full space-y-6">
                  <PlayerControls
                    isPlaying={isPlaying}
                    onPlayPause={handlePlay}
                    onNext={onPlayNext}
                    onPrevious={onPlayPrevious}
                    onStop={handleStop}
                    showStop={true}
                    repeatMode={player.repeatMode}
                    onToggleRepeat={player.toggleRepeatMode}
                    size="lg"
                  />
                  <PlayerScrubber sound={sound} duration={duration} isPlaying={isPlaying} />
                  <PlayerVolume
                    volume={volume}
                    onChangeVolume={handleVolumeChange}
                    toggleMute={handleMute}
                    isMobile={true}
                  />
                </div>

                {/* Actions */}
                <DrawerFooter className="grid w-full grid-cols-4 gap-x-2 pt-2 pb-0">
                  <FavouriteButton songId={song.id} showLabel iconSize={28} className="w-full" />
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("queue")}
                    className="flex h-auto w-full flex-col items-center gap-y-1.5 px-3 py-2"
                  >
                    <ListMusic size={28} />
                    <span className="font-medium text-muted-foreground text-xs">Queue</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("playlist")}
                    className="flex h-auto w-full flex-col items-center gap-y-1.5 px-3 py-2"
                  >
                    <ListPlus size={28} />
                    <span className="font-medium text-muted-foreground text-xs">Playlist</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("details")}
                    className="flex h-auto w-full flex-col items-center gap-y-1.5 px-3 py-2"
                  >
                    <Info size={28} />
                    <span className="font-medium text-muted-foreground text-xs">Info</span>
                  </Button>
                </DrawerFooter>
              </div>
            )}
          </DrawerContent>
        </Drawer>
      </div>

      {/* ─── Tablet layout (md to lg) ─────────────────────────────────── */}
      <div className="hidden md:block lg:hidden">
        <div className="fixed right-0 bottom-0 left-0 z-50 h-20 border-border border-t bg-background px-4">
          <div className="grid h-full w-full grid-cols-3 items-center">
            {/* Left: cover + info */}
            <div className="flex min-w-0 items-center gap-x-3 overflow-hidden">
              <CoverArt src={imageUrl} alt={song.title || "Cover"} size="sm" />
              <SongInfo title={song.title} artists={song.album.artists} size="sm" />
            </div>

            {/* Center: playback controls */}
            <div className="flex w-full flex-col items-center justify-center gap-y-1.5">
              <PlayerControls
                isPlaying={isPlaying}
                onPlayPause={handlePlay}
                onNext={onPlayNext}
                onPrevious={onPlayPrevious}
                onStop={handleStop}
                showStop={true}
                repeatMode={player.repeatMode}
                onToggleRepeat={player.toggleRepeatMode}
                size="default"
              />
              <PlayerScrubber sound={sound} duration={duration} isPlaying={isPlaying} />
            </div>

            {/* Right: action buttons + volume */}
            <div className="flex items-center justify-end gap-x-2">
              <div className="grid max-w-[240px] flex-1 grid-cols-4 gap-x-1">
                <FavouriteButton
                  songId={song.id}
                  showLabel
                  className="w-full px-1 py-1"
                  iconSize={24}
                />
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab((prev) => (prev === "queue" ? "player" : "queue"))}
                  className={cn(
                    "flex h-auto w-full flex-col items-center gap-y-1.5 px-1 py-1",
                    activeTab === "queue" && "bg-accent text-accent-foreground",
                  )}
                >
                  <ListMusic size={24} />
                  <span className="font-medium text-muted-foreground text-xs">Queue</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setActiveTab((prev) => (prev === "playlist" ? "player" : "playlist"))
                  }
                  className={cn(
                    "flex h-auto w-full flex-col items-center gap-y-1.5 px-1 py-1",
                    activeTab === "playlist" && "bg-accent text-accent-foreground",
                  )}
                >
                  <ListPlus size={24} />
                  <span className="font-medium text-muted-foreground text-xs">Playlist</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setActiveTab((prev) => (prev === "details" ? "player" : "details"))
                  }
                  className={cn(
                    "flex h-auto w-full flex-col items-center gap-y-1.5 px-1 py-1",
                    activeTab === "details" && "bg-accent text-accent-foreground",
                  )}
                >
                  <Info size={24} />
                  <span className="font-medium text-muted-foreground text-xs">Info</span>
                </Button>
              </div>
              <div className="ml-1 w-28 shrink-0">
                <PlayerVolume
                  volume={volume}
                  onChangeVolume={handleVolumeChange}
                  toggleMute={handleMute}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tablet: queue panel overlay above the bar */}
        {activeTab === "queue" && (
          <div
            className="fixed right-4 bottom-20 z-50 w-72 overflow-hidden rounded-lg border border-border bg-background shadow-xl"
            style={{ maxHeight: "400px" }}
          >
            <QueuePanel onClose={() => setActiveTab("player")} />
          </div>
        )}
        {/* Tablet: playlist panel overlay above the bar */}
        {activeTab === "playlist" && (
          <div
            className="fixed right-4 bottom-20 z-50 w-72 overflow-hidden rounded-lg border border-border bg-background shadow-xl"
            style={{ maxHeight: "400px" }}
          >
            <PlaylistPanel songId={song.id} onClose={() => setActiveTab("player")} />
          </div>
        )}
        {/* Tablet: details panel overlay above the bar */}
        {activeTab === "details" && (
          <div
            className="fixed right-4 bottom-20 z-50 w-72 overflow-hidden rounded-lg border border-border bg-background shadow-xl"
            style={{ maxHeight: "400px" }}
          >
            <SongDetailsPanel
              song={song}
              imageUrl={imageUrl}
              onClose={() => setActiveTab("player")}
            />
          </div>
        )}
      </div>

      {/* ─── Desktop layout (lg+) ─────────────────────────────────────── */}
      <div className="fixed top-0 right-0 z-50 hidden h-full w-80 flex-col border-border border-l bg-background shadow-xl lg:flex">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "player" | "queue" | "playlist" | "details")}
          className="flex h-full flex-col"
        >
          {/* Hidden tab list — controlled programmatically */}
          <TabsList className="hidden">
            <TabsTrigger value="player">Player</TabsTrigger>
            <TabsTrigger value="queue">Queue</TabsTrigger>
            <TabsTrigger value="playlist">Playlist</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Player tab */}
          <TabsContent
            value="player"
            className="mt-0 flex h-full flex-col data-[state=inactive]:hidden"
          >
            {/* Top section: cover + info + actions */}
            <div className="flex flex-1 flex-col items-center space-y-6 overflow-y-auto p-6">
              <CoverArt src={imageUrl} alt={song.title || "Cover"} size="lg" />

              <SongInfo title={song.title} artists={song.album.artists} size="lg" />

              <div className="grid w-full grid-cols-4 gap-x-2">
                <FavouriteButton songId={song.id} showLabel className="w-full" />
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("queue")}
                  className={cn(
                    "flex h-auto w-full flex-col items-center gap-y-1.5 px-3 py-2",
                    activeTab === "queue" && "bg-accent text-accent-foreground",
                  )}
                >
                  <ListMusic size={26} />
                  <span className="font-medium text-muted-foreground text-xs">Queue</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("playlist")}
                  className={cn(
                    "flex h-auto w-full flex-col items-center gap-y-1.5 px-3 py-2",
                    activeTab === "playlist" && "bg-accent text-accent-foreground",
                  )}
                >
                  <ListPlus size={26} />
                  <span className="font-medium text-muted-foreground text-xs">Playlist</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("details")}
                  className={cn(
                    "flex h-auto w-full flex-col items-center gap-y-1.5 px-3 py-2",
                    activeTab === "details" && "bg-accent text-accent-foreground",
                  )}
                >
                  <Info size={26} />
                  <span className="font-medium text-muted-foreground text-xs">Info</span>
                </Button>
              </div>
            </div>

            {/* Bottom section: controls + volume */}
            <div className="space-y-4 border-border border-t p-6">
              <PlayerScrubber sound={sound} duration={duration} isPlaying={isPlaying} />
              <PlayerControls
                isPlaying={isPlaying}
                onPlayPause={handlePlay}
                onNext={onPlayNext}
                onPrevious={onPlayPrevious}
                onStop={handleStop}
                showStop={true}
                repeatMode={player.repeatMode}
                onToggleRepeat={player.toggleRepeatMode}
                size="default"
              />
              <PlayerVolume
                volume={volume}
                onChangeVolume={handleVolumeChange}
                toggleMute={handleMute}
              />
            </div>
          </TabsContent>

          {/* Queue tab */}
          <TabsContent
            value="queue"
            className="mt-0 flex h-full flex-col data-[state=inactive]:hidden"
          >
            <QueuePanel onClose={() => setActiveTab("player")} />
          </TabsContent>

          {/* Playlist tab */}
          <TabsContent
            value="playlist"
            className="mt-0 flex h-full flex-col data-[state=inactive]:hidden"
          >
            <PlaylistPanel songId={song.id} onClose={() => setActiveTab("player")} />
          </TabsContent>

          {/* Details tab */}
          <TabsContent
            value="details"
            className="mt-0 flex h-full flex-col data-[state=inactive]:hidden"
          >
            <SongDetailsPanel
              song={song}
              imageUrl={imageUrl}
              onClose={() => setActiveTab("player")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default PlayerContent;
