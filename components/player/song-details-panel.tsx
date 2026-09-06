"use client";

import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/routes";
import type { SongWithAlbum } from "../../types/music/song-with-album";
import PanelBackButton from "./panel-back-button";

/**
 * Player panel displaying detailed song metadata and navigation.
 * Shows album cover with direct links to album and artist pages.
 * Displays track number, release date, and upload timestamp.
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
    <div className="flex h-full flex-col">
      {/* Header — matches PlaylistPanel pattern */}
      <div className="flex items-center gap-x-2 border-border border-b p-4">
        <PanelBackButton onClick={onClose} iconType="back" />
        <span className="flex-1 pr-8 text-center font-semibold text-sm">Song Details</span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {/* Cover art */}
        <div className="flex justify-center">
          <Link href={ROUTES.ALBUMS.detail(song.albumId)} onClick={onClose} className="block">
            {imageUrl ? (
              <div className="relative h-24 w-24 overflow-hidden rounded-md">
                <Image
                  src={imageUrl}
                  alt={song.album.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            ) : (
              <div className="h-24 w-24 rounded-md bg-muted" />
            )}
          </Link>
        </div>

        {/* Song title */}
        <div>
          <p className="mb-0.5 text-muted-foreground text-xs">Title</p>
          <p className="font-bold text-base leading-tight">{song.title}</p>
        </div>

        {/* Album — clickable */}
        <div>
          <p className="mb-0.5 text-muted-foreground text-xs">Album</p>
          <Link
            href={ROUTES.ALBUMS.detail(song.albumId)}
            onClick={onClose}
            className="text-sm hover:underline"
          >
            {song.album.title}
          </Link>
        </div>

        {/* Artists — each clickable */}
        <div>
          <p className="mb-0.5 text-muted-foreground text-xs">
            {song.album.artists.length !== 1 ? "Artists" : "Artist"}
          </p>
          <div className="flex flex-wrap gap-x-1">
            {song.album.artists.map((artist, i) => (
              <span key={artist.id} className="text-sm">
                <Link
                  href={ROUTES.ARTISTS.detail(artist.id)}
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
          <p className="mb-0.5 text-muted-foreground text-xs">Track</p>
          <p className="text-sm">{song.trackNumber}</p>
        </div>

        {/* Release date */}
        {releaseDate && (
          <div>
            <p className="mb-0.5 text-muted-foreground text-xs">Released</p>
            <p className="text-sm">{releaseDate}</p>
          </div>
        )}

        {/* Added date */}
        {addedDate && (
          <div>
            <p className="mb-0.5 text-muted-foreground text-xs">Added</p>
            <p className="text-sm">{addedDate}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongDetailsPanel;
