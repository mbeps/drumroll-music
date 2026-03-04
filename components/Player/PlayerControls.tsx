"use client";

import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill, BsStopFill } from "react-icons/bs";
import { cn } from "@/lib/utils";

/**
 * Interface for the PlayerControls component props.
 * 
 * @author Maruf Bepary
 */
interface PlayerControlsProps {
  /**
   * Whether audio is currently playing.
   */
  isPlaying: boolean;
  /**
   * Callback to toggle play/pause state.
   */
  onPlayPause: () => void;
  /**
   * Callback to skip to the next track.
   */
  onNext: () => void;
  /**
   * Callback to skip to the previous track.
   */
  onPrevious: () => void;
  /**
   * Optional callback to stop playback and clear the player.
   */
  onStop?: () => void;
  /**
   * Whether the stop button should be displayed.
   */
  showStop?: boolean;
  /**
   * The visual scale of the control buttons.
   */
  size?: "sm" | "default" | "lg";
}

const sizeConfig = {
  sm: { iconSize: 20, stopSize: 18, playSize: 20, circle: "h-8 w-8", gap: "gap-x-3" },
  default: { iconSize: 24, stopSize: 22, playSize: 24, circle: "h-10 w-10", gap: "gap-x-4" },
  lg: { iconSize: 32, stopSize: 28, playSize: 32, circle: "h-16 w-16", gap: "gap-x-6" },
};

/**
 * Visual controls for the global audio player.
 * Provides interactive buttons for playback (Play/Pause, Next, Previous, Stop).
 * Supports multiple size configurations for different viewports (mobile, tablet, desktop).
 * 
 * @param props - Component properties for playback control and visual configuration
 * @author Maruf Bepary
 */
const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onStop,
  showStop = false,
  size = "default",
}) => {
  const { iconSize, stopSize, playSize, circle, gap } = sizeConfig[size];
  const PlayPauseIcon = isPlaying ? BsPauseFill : BsPlayFill;

  return (
    <div className={cn("flex items-center justify-center", gap)}>
      <button
        type="button"
        aria-label="Previous"
        onClick={onPrevious}
        className="text-muted-foreground hover:text-foreground cursor-pointer transition"
      >
        <AiFillStepBackward size={iconSize} />
      </button>
      <button
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={onPlayPause}
        className={cn(
          "flex items-center justify-center rounded-full bg-foreground text-background hover:scale-105 transition cursor-pointer",
          circle,
        )}
      >
        <PlayPauseIcon size={playSize} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={onNext}
        className="text-muted-foreground hover:text-foreground cursor-pointer transition"
      >
        <AiFillStepForward size={iconSize} />
      </button>
      {showStop && (
        <button
          type="button"
          aria-label="Stop"
          onClick={(e) => {
            e.stopPropagation();
            onStop?.();
          }}
          className="text-muted-foreground hover:text-foreground cursor-pointer transition"
        >
          <BsStopFill size={stopSize} />
        </button>
      )}
    </div>
  );
};

export default PlayerControls;
