"use client";

import Image from "next/image";
import { GripVertical, X } from "lucide-react";
import { cn, formatArtists } from "@/lib/utils";
import useLoadImage from "@/hooks/useLoadImage";
import type { SongWithAlbum } from "../../types/song-with-album";
/**
 * Interface for QueueSongItem component props.
 * 
 * @author Maruf Bepary
 */
interface QueueSongItemProps {
  /**
   * Complete metadata for the song.
   */
  song: SongWithAlbum;
  /**
   * Indicates if the song is currently playing.
   */
  isActive: boolean;
  /**
   * Callback function to start playback of the song.
   * @param id - The ID of the song to play
   */
  onPlay: (id: number) => void;
  /**
   * Callback function to remove the song from the queue.
   * @param id - The ID of the song to remove
   */
  onRemove: (id: number) => void;
  /**
   * Optional drag handle attributes for drag-and-drop support.
   */
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

/**
 * Renders an animated bar graph indicating that a song is currently playing.
 * 
 * @returns React functional component
 * @author Maruf Bepary
 */
const PlayingBars = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="currentColor"
    className="text-green-400 shrink-0"
    aria-label="Now playing"
  >
    <rect x="0" y="6" width="3" height="8" rx="1">
      <animate attributeName="height" values="8;3;8" dur="0.9s" repeatCount="indefinite" />
      <animate attributeName="y" values="6;9;6" dur="0.9s" repeatCount="indefinite" />
    </rect>
    <rect x="5" y="3" width="3" height="11" rx="1">
      <animate attributeName="height" values="11;4;11" dur="0.7s" repeatCount="indefinite" />
      <animate attributeName="y" values="3;8;3" dur="0.7s" repeatCount="indefinite" />
    </rect>
    <rect x="10" y="5" width="3" height="9" rx="1">
      <animate attributeName="height" values="9;5;9" dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="y" values="5;7;5" dur="1.1s" repeatCount="indefinite" />
    </rect>
  </svg>
);

/**
 * A simplified song list item optimized for the queue panel.
 * Displays title, artist, album art, and persistent play/remove controls.
 * Supports drag-and-drop through optional drag handle props.
 * 
 * @param props - QueueSongItem props including metadata and interaction handlers
 * @returns React functional component
 * @author Maruf Bepary
 */
const QueueSongItem: React.FC<QueueSongItemProps> = ({
  song,
  isActive,
  onPlay,
  onRemove,
  dragHandleProps,
}) => {
  const imageUrl = useLoadImage(song.album.coverImagePath);

  return (
    <div
      className={cn(
        "group flex items-center gap-x-2 px-2 py-1.5 rounded-md cursor-pointer",
        "hover:bg-accent transition-colors",
        isActive && "bg-accent"
      )}
      onClick={() => onPlay(song.id)}
    >
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        className="shrink-0 p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={14} />
      </div>

      {/* Album art */}
      <div className="relative shrink-0 w-9 h-9 rounded overflow-hidden">
        <Image
          src={imageUrl || "/images/music-placeholder.png"}
          fill
          sizes="36px"
          alt=""
          className="object-cover"
        />
      </div>

      {/* Text block */}
      <div className="flex-1 min-w-0 flex flex-col">
        <p
          className={cn(
            "text-sm font-medium truncate leading-tight",
            isActive && "text-primary"
          )}
        >
          {song.title}
        </p>
        <p className="text-xs text-muted-foreground truncate leading-tight">
          {formatArtists(song.album)}
        </p>
      </div>

      {/* Right zone: playing indicator + remove button */}
      <div className="shrink-0 flex items-center gap-x-1">
        {isActive && <PlayingBars />}
        <button
          type="button"
          aria-label="Remove from queue"
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(song.id);
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default QueueSongItem;
