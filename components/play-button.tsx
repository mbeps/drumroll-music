import { FaPlay } from "react-icons/fa";

/**
 * Icon button for initiating playback on grid items.
 * Appears on hover over songs, albums, and playlists with a smooth animation.
 * Typically used inside grid item wrappers for consistent play triggers.
 *
 * @author Maruf Bepary
 */
const PlayButton = () => {
  return (
    <button
      className="
        transition 
        opacity-0 
        rounded-lg 
        flex 
        items-center 
        justify-center 
        bg-red-500 
        p-3
        drop-shadow-md 
        translate
        translate-y-1/4
        group-hover:opacity-100 
        group-hover:translate-y-0
        hover:scale-110
      "
    >
      <FaPlay className="text-white" />
    </button>
  );
};

export default PlayButton;
