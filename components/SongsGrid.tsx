"use client";

import type { SongWithAlbum } from "../types/song-with-album";
import { cn, GRID_CLASSES } from "@/lib/utils";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";

interface SongsGridProps {
  songs: SongWithAlbum[];
}

/**
 * A responsive grid component for displaying collections of songs.
 * Automatically handles empty states and integrates with the global playback
 * system using the `useOnPlay` hook to enable immediate playback of grid items.
 *
 * @author Maruf Bepary
 * @param songs An array of song objects with associated album metadata.
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
