"use client";

import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { Slider } from "@/components/ui/slider";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

/**
 * Props for the PlayerVolume component.
 *
 * @author Maruf Bepary
 */
interface PlayerVolumeProps {
  /**
   * Current volume level, ranging from `0` (muted) to `1` (max).
   */
  volume: number;
  /**
   * Callback to update the volume level. Called with the new value on slider change.
   */
  onChangeVolume: (value: number) => void;
  /**
   * Toggles between the previous volume level and muted (`0`).
   */
  toggleMute: () => void;
  /**
   * When true, the volume slider is rendered inline rather than in a HoverCard.
   * Use for the mobile expanded player where a hover card is not practical.
   */
  isMobile?: boolean;
}

/**
 * Volume control with mute toggle for the global audio player.
 * On desktop, the volume slider is revealed in a HoverCard when hovering the
 * speaker icon to keep the player bar compact. On mobile (`isMobile=true`),
 * the slider is rendered inline for touch accessibility.
 *
 * @param props - See PlayerVolumeProps
 * @author Maruf Bepary
 */
const PlayerVolume: React.FC<PlayerVolumeProps> = ({
  volume,
  onChangeVolume,
  toggleMute,
  isMobile,
}) => {
  const Icon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const VolumeButton = (
    <button
      type="button"
      aria-label={volume === 0 ? "Unmute" : "Mute"}
      onClick={toggleMute}
      className="text-muted-foreground hover:text-foreground cursor-pointer transition"
    >
      <Icon size={20} />
    </button>
  );

  const VolumeSlider = (
    <Slider
      aria-label="Volume"
      value={[volume]}
      onValueChange={(value) => onChangeVolume(value[0])}
      max={1}
      step={0.01}
    />
  );

  if (isMobile) {
    return (
      <div className="flex items-center gap-x-2">
        {VolumeButton}
        {VolumeSlider}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end">
      <HoverCard openDelay={100} closeDelay={200}>
        <HoverCardTrigger asChild>
          {VolumeButton}
        </HoverCardTrigger>
        <HoverCardContent side="top" align="center" className="w-32 p-3">
          {VolumeSlider}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default PlayerVolume;
