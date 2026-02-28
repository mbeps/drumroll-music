"use client";

import { useState } from "react";
import type { SongWithAlbum, AlbumWithArtists, Artist } from "@/types/types";
import SongsGrid from "@/components/SongsGrid";
import AlbumsGrid from "@/components/AlbumsGrid";
import ArtistsGrid from "@/components/ArtistsGrid";
import { Button } from "@/components/ui/button";

type SearchFilter = "all" | "songs" | "albums" | "artists";

interface SearchContentProps {
  songs: SongWithAlbum[];
  albums: AlbumWithArtists[];
  artists: Artist[];
}

const FILTERS: { value: SearchFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "songs", label: "Songs" },
  { value: "albums", label: "Albums" },
  { value: "artists", label: "Artists" },
];

const SearchContent: React.FC<SearchContentProps> = ({ songs, albums, artists }) => {
  const [activeFilter, setActiveFilter] = useState<SearchFilter>("all");

  const showSongs = activeFilter === "all" || activeFilter === "songs";
  const showAlbums = activeFilter === "all" || activeFilter === "albums";
  const showArtists = activeFilter === "all" || activeFilter === "artists";

  const isEmpty = songs.length === 0 && albums.length === 0 && artists.length === 0;

  return (
    <div className="flex flex-col gap-y-4 px-6 pb-2">
      <div className="flex items-center gap-x-2">
        {FILTERS.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.value)}
            className="cursor-pointer"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {isEmpty ? (
        <p className="text-muted-foreground">No results found.</p>
      ) : (
        <div className="flex flex-col gap-y-6">
          {showSongs && songs.length > 0 && (
            <div className="flex flex-col gap-y-2">
              {activeFilter === "all" && (
                <h2 className="text-xl font-semibold">Songs</h2>
              )}
              <SongsGrid songs={songs} />
            </div>
          )}

          {showAlbums && albums.length > 0 && (
            <div className="flex flex-col gap-y-2">
              {activeFilter === "all" && (
                <h2 className="text-xl font-semibold">Albums</h2>
              )}
              <AlbumsGrid albums={albums} />
            </div>
          )}

          {showArtists && artists.length > 0 && (
            <div className="flex flex-col gap-y-2">
              {activeFilter === "all" && (
                <h2 className="text-xl font-semibold">Artists</h2>
              )}
              <ArtistsGrid artists={artists} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchContent;
