"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import SongsGrid from "@/components/song/songs-grid";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import useAuthModal from "@/hooks/use-auth-modal";
import useUser from "@/hooks/use-user";
import type { SongWithAlbum } from "@/types/music/song-with-album";

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
      <div className="mt-4 flex items-center justify-between">
        <h2 className="font-semibold text-foreground text-xl">Explore</h2>
        <Button onClick={onUpload} variant="outline" size="sm" className="gap-x-2">
          <Plus className="h-4 w-4" />
          Add Song
        </Button>
      </div>
      <SongsGrid songs={songs} />
    </div>
  );
};

export default SongsContent;
