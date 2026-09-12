import { FaPlay } from "react-icons/fa";
import { cn } from "@/lib/utils";

/**
 * Icon button for initiating playback on grid items.
 * Appears on hover over songs, albums, and playlists with a smooth animation.
 * Typically used inside grid item wrappers for consistent play triggers.
 *
 * @author Maruf Bepary
 */
interface PlayButtonProps {
  /** Optional additional class names for styling/positioning. */
  className?: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ className }) => {
  return (
    <button
      className={cn(
        "translate flex translate-y-1/4 items-center justify-center rounded-full bg-green-500 p-3 opacity-0 drop-shadow-md transition hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100",
        className,
      )}
    >
      <FaPlay className="text-white" />
    </button>
  );
};

export default PlayButton;
