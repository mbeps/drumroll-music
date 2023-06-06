import { FaPlay } from "react-icons/fa";

/**
 * Displays a play button (when hovered).
 *
 * @returns (React.ReactNode): the play button (when hovered)
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
      <FaPlay className="text-black" />
    </button>
  );
};

export default PlayButton;
