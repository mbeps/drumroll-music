"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { SongWithAlbum } from "@/types/types";
import { useUser } from "@/hooks/useUser";
import useOnPlay from "@/hooks/useOnPlay";
import MediaItem from "@/components/MediaItem";
import FavouriteButton from "@/components/FavouriteButton";

interface FavouritesContentProps {
  songs: SongWithAlbum[];
}

const FavouritesContent: React.FC<FavouritesContentProps> = ({ songs }) => {
  const router = useRouter();
  const { isLoading, user } = useUser();
  const onPlay = useOnPlay(songs);

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
    <div className="flex flex-col gap-y-2 px-6">
      {songs.map((song) => (
        <MediaItem key={song.id} song={song} onClick={onPlay}>
          <FavouriteButton songId={song.id} />
        </MediaItem>
      ))}
    </div>
  );
};

export default FavouritesContent;
