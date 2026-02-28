"use client";

import type { Artist } from "@/types/types";
import ArtistsGrid from "@/components/ArtistsGrid";

interface ArtistsContentProps {
  artists: Artist[];
}

const ArtistsContent: React.FC<ArtistsContentProps> = ({ artists }) => {
  return (
    <div className="px-6 pb-4">
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-foreground text-xl font-semibold">Explore</h2>
      </div>
      <ArtistsGrid artists={artists} />
    </div>
  );
};

export default ArtistsContent;
