"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";

import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ListItemProps {
  image: string;
  name: string;
  href: string;
}

/**
 * Displays a list item with artwork, name, and a play button that appears on hover.
 * This component is primarily used on the landing page for quick access to entities like
 * "Favourites" or specific playlists. Clicking on the item triggers navigation to the provided href.
 *
 * @param image - Image URL to be displayed on the item.
 * @param name - Name of the item to be displayed (e.g., "Favourites").
 * @param href - Relative path to navigate to upon interaction.
 * @author Maruf Bepary
 */
const ListItem: React.FC<ListItemProps> = ({ image, name, href }) => {
  const router = useRouter();

  const onClick = () => {
    // TODO: add authentication

    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      className="
        relative 
        group 
        flex 
        items-center 
        rounded-lg
        overflow-hidden 
        gap-x-4 
        bg-muted/50 
        cursor-pointer 
        hover:bg-muted/80 
        transition 
        pr-4
        border
        border-border
      "
    >
      <div className="relative min-h-[64px] min-w-[64px]">
        <AspectRatio ratio={1 / 1}>
          <Image className="object-cover" src={image} fill sizes="64px" alt="Image" />
        </AspectRatio>
      </div>
      <p className="font-medium truncate py-5">{name}</p>
      <div
        className="
          absolute 
          transition 
          opacity-0 
          rounded-md 
          flex 
          items-center 
          justify-center 
          bg-red-500 
          p-2
          drop-shadow-md 
          right-3
          group-hover:opacity-100 
          hover:scale-110
        "
      >
        <FaPlay className="text-white" />
      </div>
    </button>
  );
};

export default ListItem;
