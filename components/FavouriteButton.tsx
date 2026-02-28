"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useFavourite from "@/hooks/useFavourite";
import { Button } from "@/components/ui/button";

interface FavouriteButtonProps {
  songId: number;
}

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
