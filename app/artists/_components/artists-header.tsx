"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateArtistModal from "@/components/modals/create-artist-modal";
import { Button } from "@/components/ui/button";

/**
 * Client Component rendering the header section for the Artists page.
 * Contains the button to trigger the create artist modal.
 */
const ArtistsHeader = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" className="gap-x-2" onClick={() => setIsOpen(true)}>
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
