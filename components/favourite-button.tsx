"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useFavourite from "@/hooks/useFavourite";
import { Button } from "@/components/ui/button";

interface FavouriteButtonProps {
  songId: number;
}

/**
 * A toggle button for managing a song's inclusion in the user's "Favourites" playlist.
 * Reactive to the user's authentication and current liking state, providing
 * immediate visual feedback using brand-consistent iconography.
 *
 * @author Maruf Bepary
 * @param songId The unique identifier of the song to be favourited.
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
