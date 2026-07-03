"use client";

import React from "react";
import Link from "next/link";

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
          className="hover:underline hover:text-foreground transition"
        >
          {artist.name}
        </Link>
        {index < artists.length - 1 && ", "}
      </React.Fragment>
    ));
  };

  if (size === "lg") {
    return (
      <div className="flex flex-col items-center text-center space-y-1 w-full">
        <p className="text-xl font-bold truncate w-full text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground truncate w-full">
          {renderArtists()}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <p className="text-sm font-semibold truncate text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground truncate">
        {renderArtists()}
      </p>
    </div>
  );
};

export default SongInfo;
