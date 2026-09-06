"use client";

import Link from "next/link";
import React from "react";

/**
 * Song title and artist name display for the audio player.
 * Supports compact (`sm`) and expanded (`lg`) size variants.
 * Truncates overflow text with ellipsis to fit constrained layouts.
 *
 * @author Maruf Bepary
 */

interface SongInfoProps {
  /**
   * Song title to display. Renders as truncated text.
   */
  title: string | null;
  /**
   * List of artist names and IDs for navigation.
   */
  artists: { id: string; name: string }[] | null;
  /**
   * Display size variant.
   * `"sm"` is used in the compact player bar; `"lg"` in the expanded panel.
   */
  size?: "sm" | "lg";
}

/**
 * Renders the song title and artist name for the global audio player.
 * Supports two size variants: a compact inline layout (`sm`) for the player
 * bar and a centered, larger layout (`lg`) for the expanded player panel.
 * Both variants truncate overflowing text.
 *
 * @param props - See SongInfoProps
 * @author Maruf Bepary
 */
const SongInfo: React.FC<SongInfoProps> = ({ title, artists, size = "sm" }) => {
  const renderArtists = () => {
    if (!artists || artists.length === 0) return null;

    return artists.map((artist, index) => (
      <React.Fragment key={artist.id}>
        <Link
          href={`/artists/${artist.id}`}
          className="transition hover:text-foreground hover:underline"
        >
          {artist.name}
        </Link>
        {index < artists.length - 1 && ", "}
      </React.Fragment>
    ));
  };

  if (size === "lg") {
    return (
      <div className="flex w-full flex-col items-center space-y-1 text-center">
        <p className="w-full truncate font-bold text-foreground text-xl">{title}</p>
        <p className="w-full truncate text-muted-foreground text-sm">{renderArtists()}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <p className="truncate font-semibold text-foreground text-sm">{title}</p>
      <p className="truncate text-muted-foreground text-xs">{renderArtists()}</p>
    </div>
  );
};

export default SongInfo;
