"use client";

import usePlayer from "@/hooks/usePlayer";
import { cn } from "@/lib/utils";

/**
 * Props for the PlayerLayoutWrapper component.
 *
 * @author Maruf Bepary
 */
interface PlayerLayoutWrapperProps {
  /**
   * Page content to be padded to avoid being obscured by the player UI.
   */
  children: React.ReactNode;
}

/**
 * Layout wrapper that applies responsive padding to prevent page content
 * from being hidden behind the global player UI.
 * Adds bottom padding on mobile (where the player bar sits at the bottom),
 * and right-side padding on large screens (where the player slides in as a
 * side panel). Padding is only applied when a song is active in the player.
 *
 * @param props - See PlayerLayoutWrapperProps
 * @see usePlayer for the Zustand store that tracks the active song
 * @author Maruf Bepary
 */
const PlayerLayoutWrapper: React.FC<PlayerLayoutWrapperProps> = ({
  children,
}) => {
  const player = usePlayer();
  const isPlayerActive = !!player.activeId;

  return (
    <div
      className={cn(
        "h-full w-full transition-[padding] duration-300 ease-in-out",
        "pb-16 md:pb-0",
        isPlayerActive && "pb-[8rem] md:pb-20 lg:pb-0 lg:pr-80"
      )}
    >
      {children}
    </div>
  );
};

export default PlayerLayoutWrapper;
