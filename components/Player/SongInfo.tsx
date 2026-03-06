/**
 * Props for the SongInfo component.
 *
 * @author Maruf Bepary
 */
interface SongInfoProps {
  /**
   * Song title to display. Renders as truncated text.
   */
  title: string | null;
  /**
   * Formatted artist string, typically produced by `formatArtists`.
   */
  artist: string | null;
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
const SongInfo: React.FC<SongInfoProps> = ({ title, artist, size = "sm" }) => {
  if (size === "lg") {
    return (
      <div className="flex flex-col items-center text-center space-y-1 w-full">
        <p className="text-xl font-bold truncate w-full text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground truncate w-full">{artist}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <p className="text-sm font-semibold truncate text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground truncate">{artist}</p>
    </div>
  );
};

export default SongInfo;
