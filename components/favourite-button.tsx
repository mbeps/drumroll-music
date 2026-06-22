"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useFavourite from "@/hooks/use-favourite";
import { Button } from "@/components/ui/button";

/**
 * Toggle button for managing song favorites.
 * Displays fill/outline heart icon based on favorite state.
 * Integrates with the "Favourites" playlist via `useFavourite` hook.
 *
 * @author Maruf Bepary
 */

interface FavouriteButtonProps {
  /** The unique identifier of the song to toggle. */
  songId: number;
}

/**
 * Renders an icon button that toggles a song's favorite status.
 *
 * @param props - See FavouriteButtonProps
 * @author Maruf Bepary
 */
const FavouriteButton: React.FC<FavouriteButtonProps> = ({ songId }) => {
  const { isFavourite, toggleFavourite } = useFavourite(songId);
  const Icon = isFavourite ? AiFillHeart : AiOutlineHeart;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
      onClick={toggleFavourite}
      className="cursor-pointer"
    >
      <Icon color={isFavourite ? "#22c55e" : undefined} size={20} />
    </Button>
  );
};

export default FavouriteButton;
