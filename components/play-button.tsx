import { FaPlay } from "react-icons/fa";

/**
 * A specialized action button that triggers playback for a linked entity.
 * Typically used within grid items (Songs, Albums) to provide immediate access
 * to playback functionality when hovered.
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
