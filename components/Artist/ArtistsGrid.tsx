"use client";

import { useRouter } from "next/navigation";

import type { Artist } from "../../types/artist";
import { ROUTES } from "@/routes";
import { cn, GRID_CLASSES } from "@/lib/utils";
import ArtistItem from "@/components/Artist/ArtistItem";

interface ArtistsGridProps {
  artists: Artist[];
}

/**
 * A responsive layout grid for presenting artist profiles.
 * Provides a consistent discovery experience for artists across the platform,
 * managing navigation to specific artist detail routes.
 *
 * @author Maruf Bepary
 * @param artists An array of artist metadata objects.
 */
const ArtistsGrid: React.FC<ArtistsGridProps> = ({ artists }) => {
  const router = useRouter();

  if (artists.length === 0) {
    return <div className="mt-4 text-muted-foreground">No artists found.</div>;
  }

  return (
    <div className={cn(GRID_CLASSES, "mt-4")}>
      {artists.map((item, index) => (
        <ArtistItem
          onClick={(id) => router.push(ROUTES.ARTISTS.detail(id))}
          key={item.id}
          data={item}
          priority={index === 0}
        />
      ))}
    </div>
  );
};

export default ArtistsGrid;
