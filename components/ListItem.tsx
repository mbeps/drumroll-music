"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";

interface ListItemProps {
  image: string;
  name: string;
  href: string;
}

/**
 * Displays a list item with some art work, name and a play button (when hovered).
 * Clicking on the item will navigate the user to the href.
 *
 * @param image (string): image url to be displayed on the item
 * @param name (string): name of the item to be displayed
 * @param href (string): href of the item to be navigated to
 * @returns (React.ReactNode): the item
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
        bg-neutral-100/10 
        cursor-pointer 
        hover:bg-neutral-100/20 
        transition 
        pr-4
      "
    >
      <div className="relative min-h-[64px] min-w-[64px]">
        <Image className="object-cover" src={image} fill alt="Image" />
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
        <FaPlay className="text-black" />
      </div>
    </button>
  );
};

export default ListItem;
