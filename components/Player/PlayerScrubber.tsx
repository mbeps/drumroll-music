"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Howl } from "howler";

interface PlayerScrubberProps {
  sound: Howl | null;
  duration: number | null;
  isPlaying: boolean;
}

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const PlayerScrubber: React.FC<PlayerScrubberProps> = ({
  sound,
  duration,
  isPlaying,
}) => {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && !isDragging && sound) {
      interval = setInterval(() => {
        setPosition(sound.seek() as number);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, isDragging, sound]);

  const handleValueChange = (value: number[]) => {
    setIsDragging(true);
    setPosition(value[0]);
  };

  const handleValueCommit = (value: number[]) => {
    if (sound) {
      sound.seek(value[0]);
    }
    setPosition(value[0]);
    setIsDragging(false);
  };

  const durationInSeconds = duration ? duration / 1000 : 0;

  return (
    <div className="flex items-center gap-x-2 w-full text-xs text-muted-foreground">
      <span className="w-10 text-right">{formatTime(position)}</span>
      <Slider
        value={[position]}
        max={durationInSeconds || 0}
        step={1}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        className="flex-1"
      />
      <span className="w-10">{formatTime(durationInSeconds)}</span>
    </div>
  );
};

export default PlayerScrubber;
