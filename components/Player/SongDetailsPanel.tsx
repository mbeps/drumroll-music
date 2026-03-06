"use client";

import Image from "next/image";
import Link from "next/link";
import PanelBackButton from "./PanelBackButton";
import type { SongWithAlbum } from "../../types/song-with-album";

/**
 * Props for the SongDetailsPanel component.
 *
 * @author Maruf Bepary
 */
interface SongDetailsPanelProps {
  /**
   * Full song domain object including nested album and artists data.
   */
  song: SongWithAlbum;
  /**
   * Resolved public URL for the album cover, or null if unavailable.
   * Typically obtained via `useLoadImage`.
   */
  imageUrl: string | null;
  /**
   * Callback to close this panel and return to the main player view.
   */
  onClose: () => void;
}

/**
 * Player side-panel that displays detailed metadata for the active song.
 * Shows the album cover (linking to the album page), title, album, artists,
 * track number, release date, and the date the song was added.
 * Artist and album names are rendered as navigable links.
 * Rendered as a tab within the player's multi-panel interface.
 *
 * @param props - See SongDetailsPanelProps
 * @author Maruf Bepary
 */
const SongDetailsPanel: React.FC<SongDetailsPanelProps> = ({ song, imageUrl, onClose }) => {
  const releaseDate = song.album.releaseDate
    ? new Date(song.album.releaseDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const addedDate = song.createdAt
    ? new Date(song.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header — matches PlaylistPanel pattern */}
      <div className="flex items-center gap-x-2 p-4 border-b border-border">
        <PanelBackButton onClick={onClose} iconType="back" />
        <span className="flex-1 text-center font-semibold text-sm pr-8">
          Song Details
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Cover art */}
        <div className="flex justify-center">
          <Link href={`/albums/${song.albumId}`} onClick={onClose} className="block">
            {imageUrl ? (
              <div className="relative w-24 h-24 rounded-md overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={song.album.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-md bg-muted" />
            )}
          </Link>
        </div>

        {/* Song title */}
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Title</p>
          <p className="font-bold text-base leading-tight">{song.title}</p>
        </div>

        {/* Album — clickable */}
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Album</p>
          <Link
            href={`/albums/${song.albumId}`}
            onClick={onClose}
            className="text-sm hover:underline"
          >
            {song.album.title}
          </Link>
        </div>

        {/* Artists — each clickable */}
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">
            {song.album.artists.length !== 1 ? "Artists" : "Artist"}
          </p>
          <div className="flex flex-wrap gap-x-1">
            {song.album.artists.map((artist, i) => (
              <span key={artist.id} className="text-sm">
                <Link
                  href={`/artists/${artist.id}`}
                  onClick={onClose}
                  className="hover:underline"
                >
                  {artist.name}
                </Link>
                {i < song.album.artists.length - 1 && ","}
              </span>
            ))}
          </div>
        </div>

        {/* Track number */}
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Track</p>
          <p className="text-sm">{song.trackNumber}</p>
        </div>

        {/* Release date */}
        {releaseDate && (
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Released</p>
            <p className="text-sm">{releaseDate}</p>
          </div>
        )}

        {/* Added date */}
        {addedDate && (
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Added</p>
            <p className="text-sm">{addedDate}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongDetailsPanel;
