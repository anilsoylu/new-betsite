"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TeamLineup, LineupPlayer } from "@/types/football";

interface TeamPitchViewProps {
  lineup: TeamLineup;
  teamColor?: "blue" | "red" | "green";
}

export function TeamPitchView({
  lineup,
  teamColor = "blue",
}: TeamPitchViewProps) {
  const columns = groupPlayersByPosition(lineup.starters);

  return (
    <div className="relative bg-gradient-to-b from-green-700 via-green-600 to-green-700 dark:from-green-900 dark:via-green-800 dark:to-green-900 rounded-lg overflow-hidden">
      {/* Pitch markings */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Center line */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/20" />
        {/* Center circle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/20 rounded-full" />
        {/* Center dot */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/20 rounded-full" />

        {/* Top penalty area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-10 border-b border-l border-r border-white/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 border-b border-l border-r border-white/20" />

        {/* Bottom penalty area */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-10 border-t border-l border-r border-white/20" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-4 border-t border-l border-r border-white/20" />
      </div>

      {/* Formation badge */}
      {lineup.formation && (
        <div className="absolute top-2 right-2 z-10">
          <Badge
            variant="secondary"
            className="text-[10px] font-mono bg-black/30 text-white border-0"
          >
            {lineup.formation}
          </Badge>
        </div>
      )}

      {/* Players container - Vertical layout */}
      <div className="relative flex flex-col min-h-[320px] py-3 px-2">
        {columns.map((column, colIndex) => (
          <div
            key={colIndex}
            className="flex justify-around items-center flex-1"
          >
            {column.map((player) => (
              <CompactPlayerMarker
                key={player.id}
                player={player}
                teamColor={teamColor}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Group players by their row position (from position field like "1:1", "2:3")
function groupPlayersByPosition(players: LineupPlayer[]): LineupPlayer[][] {
  const rowMap = new Map<number, LineupPlayer[]>();

  for (const player of players) {
    const pos = parsePosition(player.position);
    const row = pos.row || 0;

    if (!rowMap.has(row)) {
      rowMap.set(row, []);
    }
    rowMap.get(row)!.push(player);
  }

  // Sort each row's players by column
  for (const [, rowPlayers] of rowMap) {
    rowPlayers.sort((a, b) => {
      const aCol = parsePosition(a.position).col;
      const bCol = parsePosition(b.position).col;
      return aCol - bCol;
    });
  }

  // Convert to array sorted by row number (reversed for vertical display)
  const sortedRows = Array.from(rowMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, players]) => players);

  return sortedRows;
}

function parsePosition(position: string | null): { row: number; col: number } {
  if (!position) return { row: 0, col: 0 };
  const parts = position.split(":");
  if (parts.length === 2) {
    return {
      row: parseInt(parts[0], 10) || 0,
      col: parseInt(parts[1], 10) || 0,
    };
  }
  return { row: 0, col: 0 };
}

interface CompactPlayerMarkerProps {
  player: LineupPlayer;
  teamColor: "blue" | "red" | "green";
}

function CompactPlayerMarker({ player, teamColor }: CompactPlayerMarkerProps) {
  const initials = getInitials(player.name);
  const shortName = getShortName(player.name);

  const colorClasses = {
    blue: {
      border: "border-blue-400",
      bg: "bg-blue-600",
      badge: "bg-blue-700 border-blue-500",
    },
    red: {
      border: "border-red-400",
      bg: "bg-red-600",
      badge: "bg-red-700 border-red-500",
    },
    green: {
      border: "border-emerald-400",
      bg: "bg-emerald-600",
      badge: "bg-emerald-700 border-emerald-500",
    },
  };

  const colors = colorClasses[teamColor];

  return (
    <div className="flex flex-col items-center gap-0.5">
      {/* Player avatar with jersey number badge */}
      <div className="relative">
        <Avatar className={cn("w-8 h-8 border-2 shadow-lg", colors.border)}>
          <AvatarImage src={player.image || undefined} alt={player.name} />
          <AvatarFallback
            className={cn("text-[10px] font-bold text-white", colors.bg)}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        {/* Jersey number badge */}
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shadow border text-white",
            colors.badge,
          )}
        >
          {player.jerseyNumber}
        </span>
      </div>
      {/* Player name */}
      <span className="text-[8px] font-medium text-white text-center leading-tight max-w-[50px] truncate drop-shadow-md">
        {shortName}
      </span>
    </div>
  );
}

function getShortName(fullName: string): string {
  const parts = fullName.split(" ");
  if (parts.length === 1) return fullName;
  const lastName = parts[parts.length - 1];
  return lastName.length > 8 ? lastName.substring(0, 7) + "." : lastName;
}

function getInitials(fullName: string): string {
  const parts = fullName.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
