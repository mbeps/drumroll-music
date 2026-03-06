"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateAlbumModal from "@/components/Modals/CreateAlbumModal";

/**
 * Header component for the albums list.
 * Includes a button to open the "Add Album" modal.
 */
const AlbumsHeader = () => {
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
        Add Album
      </Button>

      <CreateAlbumModal
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

export default AlbumsHeader;
