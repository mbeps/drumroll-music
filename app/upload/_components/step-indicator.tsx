"use client";

const STEPS = ["Artist", "Album", "Song"] as const;

export interface StepIndicatorProps {
  current: number;
}

/**
 * Component that renders a step-by-step indicator for the upload process.
 *
 * @param props - Component properties with current step index.
 * @author Maruf Bepary
 */
export default function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="mb-6 flex items-center gap-x-2">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <div key={label} className="flex items-center gap-x-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full font-bold text-xs transition-colors ${
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {stepNum}
            </div>
            <span
              className={`font-medium text-sm ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 ${done ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
