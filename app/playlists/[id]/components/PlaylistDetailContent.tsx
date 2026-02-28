"use client";

import type { PlaylistWithSongs } from "@/types/types";
import SongsGrid from "@/components/SongsGrid";

interface PlaylistDetailContentProps {
  playlist: PlaylistWithSongs;
}

const PlaylistDetailContent: React.FC<PlaylistDetailContentProps> = ({
  playlist,
}) => {
  return (
    <div className="flex flex-col gap-y-6 px-6 pb-6">
      {/* Playlist Header */}
      <div className="flex flex-col gap-y-2">
        <p className="text-sm font-medium text-muted-foreground">Playlist</p>
        <h1 className="text-3xl font-bold sm:text-4xl">{playlist.title}</h1>
        <p className="text-sm text-muted-foreground">
          {playlist.songs.length}{" "}
          {playlist.songs.length === 1 ? "song" : "songs"}
        </p>
      </div>

      {/* Song List */}
      <SongsGrid songs={playlist.songs} />
    </div>
  );
};

export default PlaylistDetailContent;
