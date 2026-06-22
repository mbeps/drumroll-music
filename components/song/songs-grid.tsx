"use client";

import type { SongWithAlbum } from "../../types/music/song-with-album";
import { cn } from "@/lib/utils";
import { GRID_CLASSES } from "@/lib/grid-classes";
import SongItem from "@/components/song/song-item";
import useOnPlay from "@/hooks/use-on-play";

/**
 * Responsive grid layout for displaying songs.
 * Integrates with the global player via `useOnPlay` to manage queue and playback.
 * Handles empty states with user-friendly messaging.
 *
 * @author Maruf Bepary
 */

interface SongsGridProps {
  /** Array of songs with associated album metadata to display. */
  songs: SongWithAlbum[];
}

/**
 * Renders a responsive grid of song cards with playback integration.
 *
 * @param props - See SongsGridProps
 * @author Maruf Bepary
 */
const SongsGrid: React.FC<SongsGridProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);

  if (songs.length === 0) {
    return <div className="mt-4 text-muted-foreground">No songs available.</div>;
  }

  return (
    <div className={cn(GRID_CLASSES, "mt-4")}>
      {songs.map((item, index) => (
        <SongItem
          onClick={(id) => onPlay(id)}
          key={item.id}
          data={item}
          priority={index === 0}
        />
      ))}
    </div>
  );
};

export default SongsGrid;
