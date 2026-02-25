"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CoverArtProps {
  src: string;
  alt: string;
  size?: "sm" | "lg";
}

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
