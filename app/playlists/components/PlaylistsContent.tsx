"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { Playlist } from "@/types/types";
import { useUser } from "@/hooks/useUser";
import PlaylistItem from "@/components/PlaylistItem";

interface PlaylistsContentProps {
  playlists: Playlist[];
}

const PlaylistsContent: React.FC<PlaylistsContentProps> = ({ playlists }) => {
  const router = useRouter();
  const { isLoading, user } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (!playlists.length) {
    return (
      <div className="flex flex-col gap-y-2 px-6">
        <p className="text-muted-foreground">
          No playlists yet. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 px-6">
      {playlists.map((playlist) => (
        <PlaylistItem
          key={playlist.id}
          data={playlist}
          onClick={(id) => router.push(`/playlists/${id}`)}
        />
      ))}
    </div>
  );
};

export default PlaylistsContent;
