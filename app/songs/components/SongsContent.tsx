"use client";

import { Song } from "@/types/types";
import SongsGrid from "@/components/SongsGrid";
import { AiOutlinePlus } from "react-icons/ai";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import { Button } from "@/components/ui/button";

interface SongsContentProps {
  songs: Song[];
}

const SongsContent: React.FC<SongsContentProps> = ({ songs }) => {
  const { user } = useUser();
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();

  const onUpload = () => {
    if (!user) {
      return authModal.onOpen();
    }
    return uploadModal.onOpen();
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
          <AiOutlinePlus />
          Add Song
        </Button>
      </div>
      <SongsGrid songs={songs} />
    </div>
  );
};

export default SongsContent;
