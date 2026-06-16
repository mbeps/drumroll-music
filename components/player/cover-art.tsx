"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

/**
 * Props for the CoverArt component.
 *
 * @author Maruf Bepary
 */
interface CoverArtProps {
  /**
   * Public URL for the cover image, typically resolved via `useLoadImage`.
   */
  src: string;
  /**
   * Accessible alt text for the image, usually the album or song title.
   */
  alt: string;
  /**
   * Controls the rendered size of the image.
   * `"sm"` renders a 48×48 px thumbnail (used in queue/player bar).
   * `"lg"` renders a full-width square (used in the expanded player panel).
   */
  size?: "sm" | "lg";
}

/**
 * Displays a square album cover image with rounded corners.
 * Uses next/image for optimized loading and AspectRatio to enforce a 1:1 ratio.
 * Renders in two sizes: a compact thumbnail (`sm`) for the player bar and
 * queue rows, and a large variant (`lg`) for the expanded player panel.
 *
 * @param props - See CoverArtProps
 * @author Maruf Bepary
 */
const CoverArt: React.FC<CoverArtProps> = ({ src, alt, size = "sm" }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md",
        size === "sm" && "h-12 w-12 min-w-[48px]",
        size === "lg" && "w-full shadow-lg"
      )}
    >
      <AspectRatio ratio={1 / 1}>
        <Image
          src={src}
          fill
          sizes={size === "lg" ? "(max-width: 1024px) 95vw, 256px" : "48px"}
          alt={alt}
          className="object-cover"
        />
      </AspectRatio>
    </div>
  );
};

export default CoverArt;
