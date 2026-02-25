"use client";

import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { cn } from "@/lib/utils";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  size?: "sm" | "default" | "lg";
}

const sizeConfig = {
  sm: { iconSize: 20, playSize: 20, circle: "h-8 w-8", gap: "gap-x-3" },
  default: { iconSize: 24, playSize: 24, circle: "h-10 w-10", gap: "gap-x-4" },
  lg: { iconSize: 32, playSize: 32, circle: "h-16 w-16", gap: "gap-x-6" },
};

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  size = "default",
}) => {
  const { iconSize, playSize, circle, gap } = sizeConfig[size];
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
    </div>
  );
};

export default PlayerControls;
