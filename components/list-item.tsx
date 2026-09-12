"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import PlayButton from "@/components/song/play-button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import useAuthModal from "@/hooks/use-auth-modal";
import useUser from "@/hooks/use-user";

/**
 * Landing page list item with image, title, and hover play button.
 * Requires authentication before navigating; unauthenticated users are prompted to sign in.
 * Typically used for quick access to playlists like "Favourites" or featured collections.
 *
 * @author Maruf Bepary
 */

interface ListItemProps {
  /** Image URL for the list item thumbnail. */
  image: string;
  /** Display name (e.g., "Favourites", "New Releases"). */
  name: string;
  /** Relative navigation path (e.g., "/favourites"). */
  href: string;
}

/**
 * Renders a clickable grid item with thumbnail and play button on hover.
 *
 * @param props - See ListItemProps
 * @author Maruf Bepary
 */
const ListItem: React.FC<ListItemProps> = ({ image, name, href }) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const { user } = useUser();

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      className="group relative flex cursor-pointer items-center gap-x-4 overflow-hidden rounded-lg border border-border bg-muted/50 pr-4 transition hover:bg-muted/80"
    >
      <div className="relative min-h-[64px] min-w-[64px]">
        <AspectRatio ratio={1 / 1}>
          <Image className="object-cover" src={image} fill sizes="64px" alt="Image" />
        </AspectRatio>
      </div>
      <p className="truncate py-5 font-medium">{name}</p>
      <PlayButton className="absolute right-3" />
    </button>
  );
};

export default ListItem;
