"use client";

import Image from "next/image";
import type { AlbumDetail } from "@/types/types";
import useLoadImage from "@/hooks/useLoadImage";
import useOnPlay from "@/hooks/useOnPlay";
import { formatArtists } from "@/lib/utils";
import { toSongsWithAlbum } from "@/lib/mappers";
import MediaItem from "@/components/MediaItem";
import FavouriteButton from "@/components/FavouriteButton";

interface AlbumDetailContentProps {
  album: AlbumDetail;
}

const AlbumDetailContent: React.FC<AlbumDetailContentProps> = ({ album }) => {
  const songsWithAlbum = toSongsWithAlbum(album);

  const onPlay = useOnPlay(songsWithAlbum);
  const imageUrl = useLoadImage(album.coverImagePath);

  const artistNames = formatArtists(album);
  const releaseYear = album.releaseDate
    ? new Date(album.releaseDate).getFullYear()
    : null;

  return (
    <div className="flex flex-col gap-y-6 px-6 pb-6">
      {/* Album Header */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-md shadow-lg sm:h-56 sm:w-56">
          <Image
            src={imageUrl ?? "/images/music-placeholder.png"}
            fill
            sizes="(max-width: 640px) 192px, 224px"
            alt={album.title}
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col items-center gap-y-2 sm:items-start">
          <h1 className="text-3xl font-bold sm:text-4xl">{album.title}</h1>
          <p className="text-sm text-muted-foreground">
            {artistNames}
            {releaseYear && ` • ${releaseYear}`}
            {` • ${album.songs.length} ${album.songs.length === 1 ? "track" : "tracks"}`}
          </p>
        </div>
      </div>

      {/* Track Listing */}
      <div className="flex flex-col gap-y-2">
        <h2 className="text-xl font-semibold">Tracks</h2>
        {songsWithAlbum.length === 0 ? (
          <p className="text-muted-foreground">No tracks in this album.</p>
        ) : (
          <div className="flex flex-col">
            {songsWithAlbum.map((song) => (
              <MediaItem key={song.id} song={song} onClick={onPlay}>
                <FavouriteButton songId={song.id} />
              </MediaItem>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetailContent;
