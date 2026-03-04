"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { SongWithAlbum } from "@/types/types";
import { useUser } from "@/hooks/useUser";
import SongsGrid from "@/components/SongsGrid";

interface FavouritesContentProps {
  songs: SongWithAlbum[];
}

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
