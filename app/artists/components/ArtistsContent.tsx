"use client";

import type { Artist } from "../../../types/artist";
import ArtistsGrid from "@/components/Artist/ArtistsGrid";
import ArtistsHeader from "./ArtistsHeader";

interface ArtistsContentProps {
  artists: Artist[];
}

/**
 * Client Component that renders a grid of artists.
 * Includes a header with search/add functionality.
 * 
 * @param props.artists Array of artist objects to display.
 */
const ArtistsContent: React.FC<ArtistsContentProps> = ({ artists }) => {
  return (
    <div className="px-6 pb-4">
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-foreground text-xl font-semibold">Explore</h2>
        <ArtistsHeader />
      </div>
      <ArtistsGrid artists={artists} />
    </div>
  );
};

export default ArtistsContent;
