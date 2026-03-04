"use client";

/**
 * @deprecated The /liked route now redirects to /favourites.
 * This component is no longer used and can be removed in a future cleanup.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LikedContent = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/favourites");
  }, [router]);

  return null;
};

export default LikedContent;
