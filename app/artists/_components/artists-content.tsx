"use client";

import ArtistsGrid from "@/components/artist/artists-grid";
import type { Artist } from "../../../types/artist/artist";
import ArtistsHeader from "./artists-header";

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
      <div className="mt-4 flex items-center justify-between">
        <h2 className="font-semibold text-foreground text-xl">Explore</h2>
        <ArtistsHeader />
      </div>
      <ArtistsGrid artists={artists} />
    </div>
  );
};

export default ArtistsContent;
