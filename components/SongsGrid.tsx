"use client";

import { Song } from "@/types/types";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";

interface SongsGridProps {
  songs: Song[];
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
    <div
      className="
        grid 
        grid-cols-1 
        sm:grid-cols-3 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        2xl:grid-cols-8 
        gap-4 
        mt-4
      "
    >
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
