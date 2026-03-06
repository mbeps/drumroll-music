"use client";

import { useRouter } from "next/navigation";

import type { AlbumWithArtists } from "../types/album-with-artists";
import { cn, GRID_CLASSES } from "@/lib/utils";
import AlbumItem from "@/components/AlbumItem";

interface AlbumsGridProps {
  albums: AlbumWithArtists[];
}

/**
 * A standardized responsive grid for browsing album collections.
 * Handles navigation to individual album detail pages upon item selection.
 * Uses shared `GRID_CLASSES` for visual consistency throughout the discovery interface.
 *
 * @author Maruf Bepary
 * @param albums An array of album objects including their primary artists.
 */
const AlbumsGrid: React.FC<AlbumsGridProps> = ({ albums }) => {
  const router = useRouter();

  if (albums.length === 0) {
    return <div className="mt-4 text-muted-foreground">No albums available.</div>;
  }

  return (
    <div className={cn(GRID_CLASSES, "mt-4")}>
      {albums.map((item, index) => (
        <AlbumItem
          onClick={(id) => router.push(`/albums/${id}`)}
          key={item.id}
          data={item}
          priority={index === 0}
        />
      ))}
    </div>
  );
};

export default AlbumsGrid;
