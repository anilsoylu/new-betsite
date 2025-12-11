"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getPlayerUrl } from "@/lib/utils";
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
        <div className="flex justify-between items-center px-2 sm:px-4 py-2 sm:py-3 bg-muted/50 border-b">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {homeTeam.logo && (
              <Image
                src={homeTeam.logo}
                alt={homeTeam.name}
                width={24}
                height={24}
                className="object-contain shrink-0"
              />
            )}
            <span className="font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
              {homeTeam.name}
            </span>
            {homeLineup?.formation && (
              <Badge
                variant="outline"
                className="text-[10px] sm:text-xs font-mono shrink-0"
              >
                {homeLineup.formation}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {awayLineup?.formation && (
              <Badge
                variant="outline"
                className="text-[10px] sm:text-xs font-mono shrink-0"
              >
                {awayLineup.formation}
              </Badge>
            )}
            <span className="font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
              {awayTeam.name}
            </span>
            {awayTeam.logo && (
              <Image
                src={awayTeam.logo}
                alt={awayTeam.name}
                width={24}
                height={24}
                className="object-contain shrink-0"
              />
            )}
          </div>
        </div>

        {/* Football Pitch - Vertical on mobile, Horizontal on desktop */}
        <div className="relative bg-gradient-to-b sm:bg-gradient-to-r from-green-700 via-green-600 to-green-700 dark:from-green-900 dark:via-green-800 dark:to-green-900">
          {/* Pitch markings - Mobile (vertical) */}
          <div className="absolute inset-0 pointer-events-none sm:hidden">
            {/* Center line - horizontal on mobile */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/30" />
            {/* Center circle */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/30 rounded-full" />
            {/* Center dot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/30 rounded-full" />

            {/* Top penalty area (Home) */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-32 h-12 border-b border-l border-r border-white/30" />
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-5 border-b border-l border-r border-white/30" />

            {/* Bottom penalty area (Away) */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-32 h-12 border-t border-l border-r border-white/30" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-16 h-5 border-t border-l border-r border-white/30" />
          </div>

          {/* Pitch markings - Desktop (horizontal) */}
          <div className="absolute inset-0 pointer-events-none hidden sm:block">
            {/* Center line - vertical on desktop */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30" />
            {/* Center circle */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-20 sm:h-20 md:w-24 md:h-24 border border-white/30 rounded-full" />
            {/* Center dot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-2 sm:h-2 bg-white/30 rounded-full" />

            {/* Left penalty area (Home) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 sm:w-12 md:w-16 sm:h-30 md:h-36 border-t border-b border-r border-white/30" />
            <div className="absolute top-1/2 -translate-y-1/2 left-0 sm:w-5 md:w-6 sm:h-16 md:h-20 border-t border-b border-r border-white/30" />

            {/* Right penalty area (Away) */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:w-12 md:w-16 sm:h-30 md:h-36 border-t border-b border-l border-white/30" />
            <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:w-5 md:w-6 sm:h-16 md:h-20 border-t border-b border-l border-white/30" />
          </div>

          {/* Players container - Vertical on mobile, Horizontal on desktop */}
          <div className="relative flex flex-col sm:flex-row min-h-[500px] sm:min-h-[420px] md:min-h-[500px] py-2 sm:py-4">
            {/* Home team (top on mobile, left on desktop) */}
            <div className="flex-1 relative">
              {homeLineup ? (
                <FormationView lineup={homeLineup} isHome={true} />
              ) : (
                <div className="flex items-center justify-center h-full text-white/60">
                  Not available
                </div>
              )}
            </div>

            {/* Away team (bottom on mobile, right on desktop) */}
            <div className="flex-1 relative">
              {awayLineup ? (
                <FormationView lineup={awayLineup} isHome={false} />
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

// Formation Layout Component - Vertical on mobile, Horizontal on desktop
interface FormationViewProps {
  lineup: TeamLineup;
  isHome: boolean;
}

function FormationView({ lineup, isHome }: FormationViewProps) {
  const columns = groupPlayersByPosition(lineup.starters);

  return (
    <div
      className={cn(
        "flex h-full items-stretch",
        // Mobile: vertical (columns become rows)
        // Desktop: horizontal
        isHome
          ? "flex-col sm:flex-row"
          : "flex-col-reverse sm:flex-row-reverse",
      )}
    >
      {columns.map((column, colIndex) => (
        <div
          key={colIndex}
          className={cn(
            "flex justify-around items-center flex-1",
            // Mobile: horizontal row of players, Desktop: vertical column
            "flex-row sm:flex-col",
            "px-1 py-1 sm:px-0 sm:py-2 md:py-4",
          )}
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
            "w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 border-2 shadow-lg",
            isHome ? "border-blue-400" : "border-red-400",
          )}
        >
          <AvatarImage src={player.image || undefined} alt={player.name} />
          <AvatarFallback
            className={cn(
              "text-[10px] sm:text-xs font-bold",
              isHome ? "bg-blue-600 text-white" : "bg-red-600 text-white",
            )}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        {/* Jersey number badge */}
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold shadow border",
            isHome
              ? "bg-blue-700 text-white border-blue-500"
              : "bg-red-700 text-white border-red-500",
          )}
        >
          {player.jerseyNumber}
        </span>
      </div>
      {/* Player name */}
      <span className="text-[7px] sm:text-[8px] md:text-[10px] font-medium text-white text-center leading-tight max-w-[45px] sm:max-w-[55px] md:max-w-[65px] truncate drop-shadow-md">
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
      {/* Formations header - responsive */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="flex items-center gap-2 p-2 sm:p-3 bg-muted/50 rounded-lg">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {homeTeam.name}
            </p>
            {homeLineup?.formation && (
              <Badge variant="outline" className="mt-1 text-xs">
                {homeLineup.formation}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 sm:p-3 bg-muted/50 rounded-lg justify-end text-right">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {awayTeam.name}
            </p>
            {awayLineup?.formation && (
              <Badge variant="outline" className="mt-1 text-xs">
                {awayLineup.formation}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Starting XI - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="hidden sm:inline">{homeTeam.name}</span>
              <span className="sm:hidden truncate max-w-[120px]">
                {homeTeam.name}
              </span>
              <span className="text-muted-foreground">- Starting XI</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 sm:px-6">
            {homeLineup ? (
              <PlayerList players={homeLineup.starters} />
            ) : (
              <p className="text-sm text-muted-foreground">Not available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="hidden sm:inline">{awayTeam.name}</span>
              <span className="sm:hidden truncate max-w-[120px]">
                {awayTeam.name}
              </span>
              <span className="text-muted-foreground">- Starting XI</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 sm:px-6">
            {awayLineup ? (
              <PlayerList players={awayLineup.starters} />
            ) : (
              <p className="text-sm text-muted-foreground">Not available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Substitutes - responsive grid */}
      {hasAnySubstitutes && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {homeTeam.name} - Substitutes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-6">
              {homeLineup && homeLineup.substitutes.length > 0 ? (
                <PlayerList players={homeLineup.substitutes} compact />
              ) : (
                <p className="text-sm text-muted-foreground">-</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {awayTeam.name} - Substitutes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-6">
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
    <div className={compact ? "space-y-1" : "space-y-1.5 sm:space-y-2"}>
      {sortedPlayers.map((player) => (
        <div
          key={player.id}
          className={cn(
            "flex items-center gap-1.5 sm:gap-2",
            compact ? "text-xs sm:text-sm" : "text-sm",
          )}
        >
          <span className="w-5 sm:w-6 text-muted-foreground tabular-nums text-right text-xs sm:text-sm">
            {player.jerseyNumber}
          </span>
          <Link
            href={getPlayerUrl(player.name, player.playerId)}
            className={cn(
              "hover:underline transition-colors truncate",
              compact
                ? "text-muted-foreground hover:text-foreground"
                : "font-medium hover:text-primary",
            )}
          >
            {player.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
