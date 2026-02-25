"use client";

import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { Slider } from "@/components/ui/slider";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface PlayerVolumeProps {
  volume: number;
  onChangeVolume: (value: number) => void;
  toggleMute: () => void;
  isMobile?: boolean;
}

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
