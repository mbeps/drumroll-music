"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Howl } from "howler";

/**
 * Props for the PlayerScrubber component.
 *
 * @author Maruf Bepary
 */
interface PlayerScrubberProps {
  /**
   * Active Howl instance from `use-sound`. Used to read and seek to positions.
   */
  sound: Howl | null;
  /**
   * Total track duration in milliseconds, or null before the sound loads.
   */
  duration: number | null;
  /**
   * Whether the track is currently playing. Controls the polling interval.
   */
  isPlaying: boolean;
}

/**
 * Formats a duration in seconds to a MM:SS string.
 * Returns `"0:00"` for invalid or zero values.
 *
 * @param seconds - Duration in seconds to format
 * @returns Formatted time string (e.g. `"3:45"`)
 * @author Maruf Bepary
 */
const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

/**
 * Playback progress scrubber with elapsed and total time displays.
 * Polls the Howl instance every second during playback to update position.
 * Pauses polling while the user is dragging the slider, then seeks on release.
 * Converts the `duration` prop (milliseconds) to seconds for the Slider max.
 *
 * @param props - See PlayerScrubberProps
 * @author Maruf Bepary
 */
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
