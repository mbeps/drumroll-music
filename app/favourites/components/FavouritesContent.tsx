"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { SongWithAlbum } from "../../../types/song-with-album";
import { useUser } from "@/hooks/useUser";
import SongsGrid from "@/components/Song/SongsGrid";

interface FavouritesContentProps {
  songs: SongWithAlbum[];
}

/**
 * Client Component that renders the list of favourite songs in a grid.
 * Handles authentication checks and redirects unauthenticated users to home.
 * 
 * @param props.songs Array of song objects to display.
 */
const FavouritesContent: React.FC<FavouritesContentProps> = ({ songs }) => {
  const router = useRouter();
  const { isLoading, user } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (!songs.length) {
    return (
      <div className="flex flex-col gap-y-2 px-6">
        <p className="text-muted-foreground">No favourite songs yet.</p>
      </div>
    );
  }

  return (
    <div className="px-6">
      <SongsGrid songs={songs} />
    </div>
  );
};

export default FavouritesContent;
