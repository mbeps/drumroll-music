"use client";

import { useRouter } from "next/navigation";
import type { SongWithAlbum } from "../../../types/song-with-album";
import SongsGrid from "@/components/SongsGrid";
import { Plus } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import { Button } from "@/components/ui/button";

interface SongsContentProps {
  songs: SongWithAlbum[];
}

const SongsContent: React.FC<SongsContentProps> = ({ songs }) => {
  const router = useRouter();
  const { user } = useUser();
  const authModal = useAuthModal();

  const onUpload = () => {
    if (!user) {
      return authModal.onOpen();
    }
    return router.push("/upload");
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
