"use client";

import type { PlaylistWithSongs } from "@/types/types";
import useOnPlay from "@/hooks/useOnPlay";
import MediaItem from "@/components/MediaItem";
import FavouriteButton from "@/components/FavouriteButton";

interface PlaylistDetailContentProps {
  playlist: PlaylistWithSongs;
}

const PlaylistDetailContent: React.FC<PlaylistDetailContentProps> = ({
  playlist,
}) => {
  const onPlay = useOnPlay(playlist.songs);

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
      {playlist.songs.length === 0 ? (
        <p className="text-muted-foreground">This playlist is empty.</p>
      ) : (
        <div className="flex flex-col">
          {playlist.songs.map((song) => (
            <MediaItem key={song.id} song={song} onClick={onPlay}>
              <FavouriteButton songId={song.id} />
            </MediaItem>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistDetailContent;
