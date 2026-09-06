"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SongsGrid from "@/components/song/songs-grid";
import { useUser } from "@/hooks/use-user";
import { ROUTES } from "@/routes";
import type { SongWithAlbum } from "../../../types/music/song-with-album";

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
      router.replace(ROUTES.HOME.path);
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
