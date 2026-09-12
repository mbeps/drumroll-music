"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import useFavourite from "@/hooks/use-favourite";
import { cn } from "@/lib/utils";

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
  /** Optional label to display below or next to the icon. */
  showLabel?: boolean;
  /** Optional additional CSS classes. */
  className?: string;
  /** Optional size for the heart icon. */
  iconSize?: number;
}

/**
 * Renders an icon button that toggles a song's favorite status.
 *
 * @param props - See FavouriteButtonProps
 * @author Maruf Bepary
 */
const FavouriteButton: React.FC<FavouriteButtonProps> = ({
  songId,
  showLabel,
  className,
  iconSize,
}) => {
  const { isFavourite, toggleFavourite } = useFavourite(songId);
  const Icon = isFavourite ? AiFillHeart : AiOutlineHeart;

  return (
    <Button
      variant="ghost"
      size={showLabel ? "default" : "icon"}
      aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
      onClick={toggleFavourite}
      className={cn(
        "cursor-pointer",
        showLabel && "flex h-auto flex-col items-center gap-x-0 gap-y-1.5 px-3 py-2",
        className,
      )}
    >
      <Icon color={isFavourite ? "#22c55e" : undefined} size={iconSize || (showLabel ? 26 : 24)} />
      {showLabel && <span className="font-medium text-muted-foreground text-xs">Like</span>}
    </Button>
  );
};

export default FavouriteButton;
