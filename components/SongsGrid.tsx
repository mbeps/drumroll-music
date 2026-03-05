"use client";

import type { SongWithAlbum } from "../types/song-with-album";
import { cn, GRID_CLASSES } from "@/lib/utils";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";

interface SongsGridProps {
  songs: SongWithAlbum[];
}

/**
 * Displays a list of songs in a grid.
 * Reusable component for displaying song collections.
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
