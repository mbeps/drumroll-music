"use client";

import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill, BsStopFill } from "react-icons/bs";
import { Repeat, Repeat1 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RepeatMode } from "../../types/repeat-mode";
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
   * Whether the repeat button should be displayed.
   */
  showRepeat?: boolean;
  /**
   * The visual scale of the control buttons.
   */
  size?: "sm" | "default" | "lg";
  /**
   * The current repeat mode of the player.
   */
  repeatMode?: RepeatMode;
  /**
   * Callback to toggle repeat mode.
   */
  onToggleRepeat?: () => void;
}

const sizeConfig = {
  sm: { iconSize: 20, stopSize: 18, playSize: 20, repeatSize: 18, circle: "h-8 w-8", gap: "gap-x-3" },
  default: { iconSize: 24, stopSize: 22, playSize: 24, repeatSize: 20, circle: "h-10 w-10", gap: "gap-x-4" },
  lg: { iconSize: 32, stopSize: 28, playSize: 32, repeatSize: 24, circle: "h-16 w-16", gap: "gap-x-6" },
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
  showRepeat = true,
  size = "default",
  repeatMode = "OFF",
  onToggleRepeat,
}) => {
  const { iconSize, stopSize, playSize, repeatSize, circle, gap } = sizeConfig[size];
  const PlayPauseIcon = isPlaying ? BsPauseFill : BsPlayFill;

  const RepeatIcon = repeatMode === "ONE" ? Repeat1 : Repeat;
  const isRepeatActive = repeatMode !== "OFF";

  return (
    <div className={cn("flex items-center justify-center", gap)}>
      {showRepeat && (
        <button
          type="button"
          aria-label="Toggle Repeat"
          onClick={onToggleRepeat}
          className={cn(
            "cursor-pointer transition",
            isRepeatActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <RepeatIcon size={repeatSize} />
        </button>
      )}

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
