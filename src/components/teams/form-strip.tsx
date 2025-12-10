"use client";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FormResult = "W" | "D" | "L";

interface FormStripProps {
  form: FormResult[];
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  className?: string;
}

const resultColors: Record<FormResult, string> = {
  W: "bg-green-500",
  D: "bg-gray-400",
  L: "bg-red-500",
};

const resultLabels: Record<FormResult, string> = {
  W: "Win",
  D: "Draw",
  L: "Loss",
};

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const gapClasses = {
  sm: "gap-0.5",
  md: "gap-1",
  lg: "gap-1.5",
};

export function FormStrip({
  form,
  size = "md",
  showLabels = false,
  className,
}: FormStripProps) {
  if (!form || form.length === 0) {
    return null;
  }

  // Take last 5 results (most recent first)
  const recentForm = form.slice(0, 5);

  return (
    <TooltipProvider>
      <div className={cn("flex items-center", gapClasses[size], className)}>
        {recentForm.map((result, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "rounded-full flex items-center justify-center",
                  sizeClasses[size],
                  resultColors[result],
                )}
              >
                {showLabels && (
                  <span className="text-[8px] font-bold text-white">
                    {result}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {resultLabels[result]}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

// Helper function to convert fixture results to form array
export function getFormFromFixtures(
  fixtures: Array<{
    homeScore?: number | null;
    awayScore?: number | null;
    isHome: boolean;
  }>,
): FormResult[] {
  return fixtures.map((fixture) => {
    const { homeScore, awayScore, isHome } = fixture;

    if (
      homeScore === null ||
      homeScore === undefined ||
      awayScore === null ||
      awayScore === undefined
    ) {
      return "D"; // Default to draw if no score
    }

    if (isHome) {
      if (homeScore > awayScore) return "W";
      if (homeScore < awayScore) return "L";
      return "D";
    } else {
      if (awayScore > homeScore) return "W";
      if (awayScore < homeScore) return "L";
      return "D";
    }
  });
}
