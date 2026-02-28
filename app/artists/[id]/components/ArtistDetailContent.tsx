"use client";

import Image from "next/image";
import type { ArtistWithAlbums } from "@/types/types";
import useLoadImage from "@/hooks/useLoadImage";
import AlbumsGrid from "@/components/AlbumsGrid";

interface ArtistDetailContentProps {
  artist: ArtistWithAlbums;
}

const ArtistDetailContent: React.FC<ArtistDetailContentProps> = ({
  artist,
}) => {
  const imageUrl = useLoadImage(artist.imageUrl);

  return (
    <div className="flex flex-col gap-y-6 px-6 pb-6">
      {/* Artist Header */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-full shadow-lg sm:h-56 sm:w-56">
          <Image
            src={imageUrl ?? "/images/music-placeholder.png"}
            fill
            sizes="(max-width: 640px) 192px, 224px"
            alt={artist.name}
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col items-center gap-y-2 sm:items-start">
          <p className="text-sm font-medium text-muted-foreground">Artist</p>
          <h1 className="text-3xl font-bold sm:text-4xl">{artist.name}</h1>
          <p className="text-sm text-muted-foreground">
            {artist.albums.length}{" "}
            {artist.albums.length === 1 ? "album" : "albums"}
          </p>
        </div>
      </div>

      {/* Albums */}
      <div className="flex flex-col gap-y-2">
        <h2 className="text-xl font-semibold">Discography</h2>
        <AlbumsGrid albums={artist.albums} />
      </div>
    </div>
  );
};

export default ArtistDetailContent;
