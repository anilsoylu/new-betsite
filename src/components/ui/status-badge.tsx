"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { MatchStatus } from "@/types/football";

interface StatusBadgeProps {
  /** Current match status */
  status: MatchStatus;
  /** Whether the match is currently live */
  isLive: boolean;
  /** Display minute for live matches (e.g., "45'", "90+3'") */
  displayMinute?: string | null;
  /** Formatted time for scheduled matches (e.g., "20:00") */
  formattedTime?: string;
  /** Additional status detail for edge cases */
  statusDetail?: string;
  /**
   * Visual variant:
   * - "default": Uses Badge component (for cards with more visual weight)
   * - "compact": Uses minimal text styling (for dense lists like MatchRow)
   */
  variant?: "default" | "compact";
  /** Additional className for customization */
  className?: string;
}

/**
 * Unified status badge component for displaying match status.
 * Handles live (with pulse animation), halftime, finished, and scheduled states.
 *
 * @example
 * // In a fixture card (default variant)
 * <StatusBadge
 *   status={status}
 *   isLive={isLive}
 *   displayMinute={displayMinute}
 *   formattedTime={formattedTime}
 * />
 *
 * @example
 * // In a match list row (compact variant)
 * <StatusBadge
 *   status={status}
 *   isLive={isLive}
 *   displayMinute={displayMinute}
 *   formattedTime={formattedTime}
 *   variant="compact"
 * />
 */
export function StatusBadge({
  status,
  isLive,
  displayMinute,
  formattedTime,
  statusDetail,
  variant = "default",
  className,
}: StatusBadgeProps) {
  // Pulse indicator component - shared between variants
  const PulseIndicator = ({ color }: { color: "red" | "orange" }) => (
    <span className="relative flex h-1.5 w-1.5">
      <span
        className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          color === "red" ? "bg-red-500" : "bg-orange-500",
        )}
      />
      <span
        className={cn(
          "relative inline-flex rounded-full h-1.5 w-1.5",
          color === "red" ? "bg-red-500" : "bg-orange-500",
        )}
      />
    </span>
  );

  // Compact variant - minimal styling for dense lists
  if (variant === "compact") {
    // Halftime
    if (status === "halftime") {
      return (
        <div
          className={cn(
            "flex items-center gap-1 min-w-[44px] justify-center",
            className,
          )}
        >
          <PulseIndicator color="orange" />
          <span className="text-xs font-bold text-orange-500">HT</span>
        </div>
      );
    }

    // Live with minute
    if (isLive) {
      return (
        <div
          className={cn(
            "flex items-center gap-1 min-w-[44px] justify-center",
            className,
          )}
        >
          <PulseIndicator color="red" />
          <span className="text-xs font-bold text-red-500">
            {displayMinute || "LIVE"}
          </span>
        </div>
      );
    }

    // Finished
    if (status === "finished") {
      return (
        <span
          className={cn(
            "text-xs font-medium text-muted-foreground min-w-[44px] text-center",
            className,
          )}
        >
          FT
        </span>
      );
    }

    // Scheduled - show time
    return (
      <span
        className={cn(
          "text-xs font-medium text-muted-foreground min-w-[44px] text-center",
          className,
        )}
      >
        {formattedTime || "--:--"}
      </span>
    );
  }

  // Default variant - uses Badge component for more visual weight
  // Halftime
  if (status === "halftime") {
    return (
      <Badge
        variant="secondary"
        className={cn(
          "text-xs h-5 px-1.5 bg-amber-500/20 text-amber-600 border-amber-500/30",
          className,
        )}
      >
        HT
      </Badge>
    );
  }

  // Live with pulse animation
  if (isLive) {
    return (
      <Badge
        variant="destructive"
        className={cn("animate-pulse text-xs h-5 px-1.5 gap-1", className)}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
        </span>
        {displayMinute || "LIVE"}
      </Badge>
    );
  }

  // Finished
  if (status === "finished") {
    return (
      <Badge
        variant="secondary"
        className={cn("text-xs h-5 px-1.5", className)}
      >
        FT
      </Badge>
    );
  }

  // Scheduled - show time
  if (status === "scheduled") {
    return (
      <span
        className={cn("text-xs font-medium text-muted-foreground", className)}
      >
        {formattedTime || "--:--"}
      </span>
    );
  }

  // Other statuses - show detail or fallback
  return (
    <Badge variant="outline" className={cn("text-xs h-5 px-1.5", className)}>
      {statusDetail || status}
    </Badge>
  );
}
