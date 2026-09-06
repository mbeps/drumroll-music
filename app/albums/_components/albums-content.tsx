"use client";

import AlbumsGrid from "@/components/album/albums-grid";
import type { AlbumWithArtists } from "../../../types/music/album-with-artists";
import AlbumsHeader from "./albums-header";

interface AlbumsContentProps {
  albums: AlbumWithArtists[];
}

/**
 * Main content component for the albums page.
 * Displays a header with an action button and a grid of albums.
 *
 * @param albums - The list of albums with their associated artists.
 */
const AlbumsContent: React.FC<AlbumsContentProps> = ({ albums }) => {
  return (
    <div className="px-6 pb-4">
      <div className="mt-4 flex items-center justify-between">
        <h2 className="font-semibold text-foreground text-xl">Explore</h2>
        <AlbumsHeader />
      </div>
      <AlbumsGrid albums={albums} />
    </div>
  );
};

export default AlbumsContent;
