"use client";

import type { AlbumWithArtists } from "../../../types/album-with-artists";
import AlbumsGrid from "@/components/AlbumsGrid";
import AlbumsHeader from "./AlbumsHeader";

interface AlbumsContentProps {
  albums: AlbumWithArtists[];
}

const AlbumsContent: React.FC<AlbumsContentProps> = ({ albums }) => {
  return (
    <div className="px-6 pb-4">
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-foreground text-xl font-semibold">Explore</h2>
        <AlbumsHeader />
      </div>
      <AlbumsGrid albums={albums} />
    </div>
  );
};

export default AlbumsContent;
