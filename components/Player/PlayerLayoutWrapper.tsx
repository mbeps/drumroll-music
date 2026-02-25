"use client";

import usePlayer from "@/hooks/usePlayer";
import { cn } from "@/lib/utils";

interface PlayerLayoutWrapperProps {
  children: React.ReactNode;
}

const PlayerLayoutWrapper: React.FC<PlayerLayoutWrapperProps> = ({
  children,
}) => {
  const player = usePlayer();
  const isPlayerActive = !!player.activeId;

  return (
    <div
      className={cn(
        "h-full w-full transition-[padding] duration-300 ease-in-out",
        isPlayerActive && "pb-16 md:pb-20 lg:pb-0 lg:pr-80"
      )}
    >
      {children}
    </div>
  );
};

export default PlayerLayoutWrapper;
