"use client";

import { useRouter } from "next/navigation";
import type { SongWithAlbum } from "../../../types/song-with-album";
import SongsGrid from "@/components/Song/SongsGrid";
import { Plus } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";

interface SongsContentProps {
  songs: SongWithAlbum[];
}

/**
 * Main content component for the songs page.
 * Displays a list of songs and provides an action button to upload new tracks.
 * 
 * @param props - Component properties.
 * @param props.songs - Array of song objects to display.
 */
const SongsContent: React.FC<SongsContentProps> = ({ songs }) => {
  const router = useRouter();
  const { user } = useUser();
  const authModal = useAuthModal();

  const onUpload = () => {
    if (!user) {
      return authModal.onOpen();
    }
    return router.push(ROUTES.UPLOAD.path);
  };

  return (
    <div className="px-6 pb-4">
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-foreground text-xl font-semibold">Explore</h2>
        <Button
          onClick={onUpload}
          variant="outline"
          size="sm"
          className="gap-x-2"
        >
          <Plus className="h-4 w-4" />
          Add Song
        </Button>
      </div>
      <SongsGrid songs={songs} />
    </div>
  );
};

export default SongsContent;
