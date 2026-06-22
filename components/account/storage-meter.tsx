"use client";

import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";

/**
 * Visual storage usage indicator with dynamic color coding.
 * Shows current storage usage as a percentage of the limit with color transitions:
 * Green (<75%), Yellow (75-90%), Red (>90%).
 *
 * @author Maruf Bepary
 */

interface StorageMeterProps {
  /** Total bytes currently used. */
  usage: number;
  /** Global capacity in bytes. */
  limit: number;
}

/**
 * Component that displays a progress bar representing personal storage usage.
 * Color shifts based on usage percentage:
 * - Green: < 75%
 * - Yellow: 75% - 90%
 * - Red: > 90%
 *
 * @author Maruf Bepary
 */
const StorageMeter: React.FC<StorageMeterProps> = ({ usage, limit }) => {
  const percentage = Math.min((usage / limit) * 100, 100);

  const usageMB = (usage / (1024 * 1024)).toFixed(2);
  const limitGB = (limit / (1024 * 1024 * 1024)).toFixed(0);

  const colorClass = useMemo(() => {
    if (percentage < 75) return "bg-emerald-500";
    if (percentage < 90) return "bg-amber-500";
    return "bg-rose-500";
  }, [percentage]);

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-y-0.5">
          <p className="text-sm font-medium text-neutral-400">
            Your Storage Usage
          </p>
          <p className="text-2xl font-bold">
            {usageMB} MB <span className="text-sm font-normal text-neutral-400">/ {limitGB} GB</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-neutral-400">
            {Math.round(percentage)}%
          </p>
        </div>
      </div>
      <Progress 
        value={percentage} 
        indicatorClassName={colorClass}
        className="h-3"
      />
    </div>
  );
};

export default StorageMeter;
