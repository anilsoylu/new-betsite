"use client";

import { useBuildXIStore } from "@/stores/build-xi-store";
import { getFormationById } from "@/lib/build-xi/formations";
import { PlayerSlot } from "./player-slot";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

/**
 * Map col values (1-5) to horizontal percentages
 * - Edge positions (1, 5) are wide at 12% and 88%
 * - Center positions (2, 4) are closer at 35% and 65%
 * - Pure center (3) is at 50%
 */
const COL_TO_PERCENT: Record<number, number> = {
  1: 12,  // Left edge (LB, LW, LWB)
  2: 35,  // Left-center (CB, CM, ST pair)
  3: 50,  // Center (GK, CAM, lone ST)
  4: 65,  // Right-center (CB, CM, ST pair)
  5: 88,  // Right edge (RB, RW, RWB)
};

/**
 * Map row values (1-5) to vertical percentages
 * Row 1 (GK) at bottom, Row 5 (strikers) at top
 */
const ROW_TO_PERCENT: Record<number, number> = {
  1: 88,  // GK
  2: 68,  // Defenders
  3: 48,  // Defensive midfielders
  4: 28,  // Attacking midfielders / Secondary strikers
  5: 10,  // Strikers
};

/**
 * Get player position as CSS percentages
 */
function getPlayerPosition(col: number, row: number) {
  const left = COL_TO_PERCENT[col] ?? 50;
  const top = ROW_TO_PERCENT[row] ?? 50;
  return { left: `${left}%`, top: `${top}%` };
}

export function PitchBuilder() {
  const currentLineup = useBuildXIStore((state) => state.currentLineup);
  const selectedSlotId = useBuildXIStore((state) => state.selectedSlotId);
  const selectSlot = useBuildXIStore((state) => state.selectSlot);
  const clearSlot = useBuildXIStore((state) => state.clearSlot);

  const formation = getFormationById(currentLineup.formationId);

  if (!formation) {
    return (
      <div className="text-center text-muted-foreground p-8">
        Formation not found
      </div>
    );
  }

  return (
    <div
      id="pitch-export"
      className={cn(
        "relative rounded-xl overflow-hidden",
        "bg-linear-to-b from-green-600 to-green-700",
        "aspect-3/4 sm:aspect-4/5 w-full max-w-md mx-auto"
      )}
    >
      {/* Pitch Markings */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Outer border */}
        <div className="absolute inset-4 sm:inset-6 border-2 border-white/30 rounded" />

        {/* Center line */}
        <div className="absolute top-1/2 left-4 right-4 sm:left-6 sm:right-6 h-0.5 bg-white/30" />

        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 border-2 border-white/30 rounded-full" />

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full" />

        {/* Top penalty area */}
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-16 sm:h-20 border-2 border-t-0 border-white/30" />

        {/* Top goal area */}
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-6 sm:h-8 border-2 border-t-0 border-white/30" />

        {/* Bottom penalty area (goalkeeper) */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-16 sm:h-20 border-2 border-b-0 border-white/30" />

        {/* Bottom goal area */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-6 sm:h-8 border-2 border-b-0 border-white/30" />

        {/* Corner arcs */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-4 h-4 border-r-2 border-b-2 border-white/30 rounded-br-full" />
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-4 h-4 border-l-2 border-b-2 border-white/30 rounded-bl-full" />
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-4 h-4 border-r-2 border-t-2 border-white/30 rounded-tr-full" />
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-4 h-4 border-l-2 border-t-2 border-white/30 rounded-tl-full" />
      </div>

      {/* Players - Absolute Positioning */}
      <div className="absolute inset-0 z-10">
        {formation.positions.map((pos) => {
          const position = getPlayerPosition(pos.col, pos.row);
          return (
            <div
              key={pos.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: position.left, top: position.top }}
            >
              <PlayerSlot
                slot={pos}
                player={currentLineup.players[pos.id]}
                isSelected={selectedSlotId === pos.id}
                onSelect={() => selectSlot(pos.id)}
                onClear={() => clearSlot(pos.id)}
              />
            </div>
          );
        })}
      </div>

      {/* Watermark - Bottom Left */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/30 backdrop-blur-sm px-2 py-1 rounded text-[10px] sm:text-xs text-white/70 z-20 font-medium">
        {SITE.name}
      </div>

      {/* Formation Badge - Bottom Right */}
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/30 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/80 z-20">
        {formation.name}
      </div>
    </div>
  );
}
