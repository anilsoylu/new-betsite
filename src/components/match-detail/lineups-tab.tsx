"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { TeamLineup, Team, LineupPlayer } from "@/types/football";

interface LineupsTabProps {
  homeLineup: TeamLineup | null;
  awayLineup: TeamLineup | null;
  homeTeam: Team;
  awayTeam: Team;
}

export function LineupsTab({
  homeLineup,
  awayLineup,
  homeTeam,
  awayTeam,
}: LineupsTabProps) {
  const [viewMode, setViewMode] = useState<"pitch" | "list">("pitch");

  const hasHomeSubstitutes = homeLineup && homeLineup.substitutes.length > 0;
  const hasAwaySubstitutes = awayLineup && awayLineup.substitutes.length > 0;
  const hasAnySubstitutes = hasHomeSubstitutes || hasAwaySubstitutes;
  const showPredictedWarning = !hasAnySubstitutes;

  return (
    <div className="space-y-4">
      {/* Predicted lineup warning */}
      {showPredictedWarning && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Predicted lineups - Official lineups will be announced closer to
            kick-off
          </AlertDescription>
        </Alert>
      )}

      {/* View mode toggle */}
      <div className="flex justify-end gap-2">
        <Button
          variant={viewMode === "pitch" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("pitch")}
        >
          Pitch View
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
        >
          <Users className="h-4 w-4 mr-1" />
          List
        </Button>
      </div>

      {viewMode === "pitch" ? (
        <PitchView
          homeLineup={homeLineup}
          awayLineup={awayLineup}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      ) : (
        <ListView
          homeLineup={homeLineup}
          awayLineup={awayLineup}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          hasAnySubstitutes={!!hasAnySubstitutes}
        />
      )}
    </div>
  );
}

// Pitch View Component - Horizontal layout like Fotmob
interface PitchViewProps {
  homeLineup: TeamLineup | null;
  awayLineup: TeamLineup | null;
  homeTeam: Team;
  awayTeam: Team;
}

function PitchView({
  homeLineup,
  awayLineup,
  homeTeam,
  awayTeam,
}: PitchViewProps) {
  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="p-0">
        {/* Header with team names and formations */}
        <div className="flex justify-between items-center px-4 py-3 bg-muted/50 border-b">
          <div className="flex items-center gap-2">
            {homeTeam.logo && (
              <Image
                src={homeTeam.logo}
                alt={homeTeam.name}
                width={24}
                height={24}
                className="object-contain w-auto h-auto"
              />
            )}
            <span className="font-medium text-sm">{homeTeam.name}</span>
            {homeLineup?.formation && (
              <Badge variant="outline" className="text-xs font-mono">
                {homeLineup.formation}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {awayLineup?.formation && (
              <Badge variant="outline" className="text-xs font-mono">
                {awayLineup.formation}
              </Badge>
            )}
            <span className="font-medium text-sm">{awayTeam.name}</span>
            {awayTeam.logo && (
              <Image
                src={awayTeam.logo}
                alt={awayTeam.name}
                width={24}
                height={24}
                className="object-contain w-auto h-auto"
              />
            )}
          </div>
        </div>

        {/* Football Pitch - Horizontal */}
        <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-green-700 dark:from-green-900 dark:via-green-800 dark:to-green-900">
          {/* Pitch markings */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Center line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30" />
            {/* Center circle */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/30 rounded-full" />
            {/* Center dot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full" />

            {/* Left penalty area (Home) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-16 h-36 border-t border-b border-r border-white/30" />
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-6 h-20 border-t border-b border-r border-white/30" />

            {/* Right penalty area (Away) */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-16 h-36 border-t border-b border-l border-white/30" />
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-6 h-20 border-t border-b border-l border-white/30" />
          </div>

          {/* Players container - Horizontal layout */}
          <div className="relative flex min-h-[500px] py-4">
            {/* Home team (left side) */}
            <div className="flex-1 relative">
              {homeLineup ? (
                <HorizontalFormation lineup={homeLineup} isHome={true} />
              ) : (
                <div className="flex items-center justify-center h-full text-white/60">
                  Not available
                </div>
              )}
            </div>

            {/* Away team (right side) */}
            <div className="flex-1 relative">
              {awayLineup ? (
                <HorizontalFormation lineup={awayLineup} isHome={false} />
              ) : (
                <div className="flex items-center justify-center h-full text-white/60">
                  Not available
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Horizontal Formation Layout Component
interface HorizontalFormationProps {
  lineup: TeamLineup;
  isHome: boolean;
}

function HorizontalFormation({ lineup, isHome }: HorizontalFormationProps) {
  const columns = groupPlayersByPosition(lineup.starters);

  return (
    <div
      className={cn(
        "flex h-full items-stretch",
        isHome ? "flex-row" : "flex-row-reverse",
      )}
    >
      {columns.map((column, colIndex) => (
        <div
          key={colIndex}
          className="flex flex-col justify-around items-center flex-1 py-4"
        >
          {column.map((player) => (
            <PlayerMarker key={player.id} player={player} isHome={isHome} />
          ))}
        </div>
      ))}
    </div>
  );
}

// Group players by their row position (from position field like "1:1", "2:3")
// Returns columns: GK | DEF | MID | FWD etc.
function groupPlayersByPosition(players: LineupPlayer[]): LineupPlayer[][] {
  // Group players by their row (first number in position)
  const rowMap = new Map<number, LineupPlayer[]>();

  for (const player of players) {
    const pos = parsePosition(player.position);
    const row = pos.row || 0;

    if (!rowMap.has(row)) {
      rowMap.set(row, []);
    }
    rowMap.get(row)!.push(player);
  }

  // Sort each row's players by column (second number in position)
  for (const [, rowPlayers] of rowMap) {
    rowPlayers.sort((a, b) => {
      const aCol = parsePosition(a.position).col;
      const bCol = parsePosition(b.position).col;
      return aCol - bCol;
    });
  }

  // Convert to array sorted by row number
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

// Player Marker Component
interface PlayerMarkerProps {
  player: LineupPlayer;
  isHome: boolean;
  onClick?: (player: LineupPlayer) => void;
}

function PlayerMarker({ player, isHome, onClick }: PlayerMarkerProps) {
  const shortName = getShortName(player.name);
  const initials = getInitials(player.name);

  return (
    <button
      type="button"
      onClick={() => onClick?.(player)}
      className="flex flex-col items-center gap-0.5 hover:scale-110 transition-transform cursor-pointer"
    >
      {/* Player avatar with jersey number badge */}
      <div className="relative">
        <Avatar
          className={cn(
            "w-9 h-9 sm:w-11 sm:h-11 border-2 shadow-lg",
            isHome ? "border-blue-400" : "border-red-400",
          )}
        >
          <AvatarImage src={player.image || undefined} alt={player.name} />
          <AvatarFallback
            className={cn(
              "text-xs font-bold",
              isHome ? "bg-blue-600 text-white" : "bg-red-600 text-white",
            )}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        {/* Jersey number badge */}
        <span
          className={cn(
            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow border",
            isHome
              ? "bg-blue-700 text-white border-blue-500"
              : "bg-red-700 text-white border-red-500",
          )}
        >
          {player.jerseyNumber}
        </span>
      </div>
      {/* Player name */}
      <span className="text-[8px] sm:text-[10px] font-medium text-white text-center leading-tight max-w-[55px] sm:max-w-[65px] truncate drop-shadow-md">
        {shortName}
      </span>
    </button>
  );
}

function getShortName(fullName: string): string {
  const parts = fullName.split(" ");
  if (parts.length === 1) return fullName;
  const lastName = parts[parts.length - 1];
  return lastName.length > 10 ? lastName.substring(0, 9) + "." : lastName;
}

function getInitials(fullName: string): string {
  const parts = fullName.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// List View Component
interface ListViewProps {
  homeLineup: TeamLineup | null;
  awayLineup: TeamLineup | null;
  homeTeam: Team;
  awayTeam: Team;
  hasAnySubstitutes: boolean;
}

function ListView({
  homeLineup,
  awayLineup,
  homeTeam,
  awayTeam,
  hasAnySubstitutes,
}: ListViewProps) {
  return (
    <div className="space-y-4">
      {/* Formations header */}
      <div className="flex justify-between items-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{homeTeam.name}</p>
          {homeLineup?.formation && (
            <Badge variant="outline" className="mt-1">
              {homeLineup.formation}
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">Formation</div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{awayTeam.name}</p>
          {awayLineup?.formation && (
            <Badge variant="outline" className="mt-1">
              {awayLineup.formation}
            </Badge>
          )}
        </div>
      </div>

      {/* Starting XI */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Starting XI</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {homeLineup ? (
              <PlayerList players={homeLineup.starters} />
            ) : (
              <p className="text-sm text-muted-foreground">Not available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Starting XI</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {awayLineup ? (
              <PlayerList players={awayLineup.starters} />
            ) : (
              <p className="text-sm text-muted-foreground">Not available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Substitutes */}
      {hasAnySubstitutes && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Substitutes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {homeLineup && homeLineup.substitutes.length > 0 ? (
                <PlayerList players={homeLineup.substitutes} compact />
              ) : (
                <p className="text-sm text-muted-foreground">-</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Substitutes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {awayLineup && awayLineup.substitutes.length > 0 ? (
                <PlayerList players={awayLineup.substitutes} compact />
              ) : (
                <p className="text-sm text-muted-foreground">-</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface PlayerListProps {
  players: LineupPlayer[];
  compact?: boolean;
}

function PlayerList({ players, compact = false }: PlayerListProps) {
  const sortedPlayers = [...players].sort(
    (a, b) => a.jerseyNumber - b.jerseyNumber,
  );

  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      {sortedPlayers.map((player) => (
        <div
          key={player.id}
          className={cn("flex items-center gap-2", compact && "text-sm")}
        >
          <span className="w-6 text-muted-foreground tabular-nums text-right">
            {player.jerseyNumber}
          </span>
          <span className={compact ? "text-muted-foreground" : "font-medium"}>
            {player.name}
          </span>
        </div>
      ))}
    </div>
  );
}
