"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateArtistModal from "@/components/Modals/CreateArtistModal";

/**
 * Client Component rendering the header section for the Artists page.
 * Contains the button to trigger the create artist modal.
 */
const ArtistsHeader = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-x-2"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Add Artist
      </Button>

      <CreateArtistModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          setIsOpen(false);
          router.refresh();
        }}
      />
    </>
  );
};

export default ArtistsHeader;
