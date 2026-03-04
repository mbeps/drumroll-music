"use client";

import { useRouter } from "next/navigation";

import type { Artist } from "@/types/types";
import { cn, GRID_CLASSES } from "@/lib/utils";
import ArtistItem from "@/components/ArtistItem";

interface ArtistsGridProps {
  artists: Artist[];
}

const ArtistsGrid: React.FC<ArtistsGridProps> = ({ artists }) => {
  const router = useRouter();

  if (artists.length === 0) {
    return <div className="mt-4 text-muted-foreground">No artists found.</div>;
  }

  return (
    <div className={cn(GRID_CLASSES, "mt-4")}>
      {artists.map((item, index) => (
        <ArtistItem
          onClick={(id) => router.push(`/artists/${id}`)}
          key={item.id}
          data={item}
          priority={index === 0}
        />
      ))}
    </div>
  );
};

export default ArtistsGrid;
