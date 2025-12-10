"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO, isValid } from "date-fns";
import { Star, Bell, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, getTeamUrl } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import type { PlayerDetail } from "@/types/football";

interface PlayerHeaderProps {
  player: PlayerDetail;
}

// Position mapping for the pitch visualization
const positionCoordinates: Record<string, { top: string; left: string }> = {
  // Goalkeepers
  Goalkeeper: { top: "85%", left: "50%" },
  GK: { top: "85%", left: "50%" },

  // Defenders
  "Centre-Back": { top: "70%", left: "50%" },
  "Left Centre Back": { top: "70%", left: "35%" },
  "Right Centre Back": { top: "70%", left: "65%" },
  "Left-Back": { top: "65%", left: "15%" },
  "Right-Back": { top: "65%", left: "85%" },
  Defender: { top: "70%", left: "50%" },

  // Midfielders
  "Defensive Midfield": { top: "55%", left: "50%" },
  "Central Midfield": { top: "45%", left: "50%" },
  "Attacking Midfield": { top: "35%", left: "50%" },
  "Left Midfield": { top: "45%", left: "20%" },
  "Right Midfield": { top: "45%", left: "80%" },
  "Left Winger": { top: "30%", left: "15%" },
  "Right Winger": { top: "30%", left: "85%" },
  Midfielder: { top: "45%", left: "50%" },

  // Forwards
  "Centre-Forward": { top: "15%", left: "50%" },
  "Second Striker": { top: "25%", left: "50%" },
  Striker: { top: "15%", left: "50%" },
  Attacker: { top: "20%", left: "50%" },
  Forward: { top: "15%", left: "50%" },
};

function getPositionAbbreviation(position: string | null): string {
  if (!position) return "?";
  const abbrevMap: Record<string, string> = {
    Goalkeeper: "GK",
    "Centre-Back": "CB",
    "Left Centre Back": "CB",
    "Right Centre Back": "CB",
    "Left-Back": "LB",
    "Right-Back": "RB",
    Defender: "DEF",
    "Defensive Midfield": "DM",
    "Central Midfield": "CM",
    "Attacking Midfield": "AM",
    "Left Midfield": "LM",
    "Right Midfield": "RM",
    "Left Winger": "LW",
    "Right Winger": "RW",
    Midfielder: "MID",
    "Centre-Forward": "ST",
    "Second Striker": "SS",
    Striker: "ST",
    Attacker: "ATT",
    Forward: "FW",
  };
  return abbrevMap[position] || position.substring(0, 2).toUpperCase();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, "d MMM yyyy") : "";
}

function formatMarketValue(value: number | null): string {
  if (!value) return "-";
  if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `€${(value / 1000).toFixed(0)}K`;
  return `€${value}`;
}

function formatPreferredFoot(foot: "left" | "right" | "both" | null): string {
  if (!foot) return "-";
  return foot.charAt(0).toUpperCase() + foot.slice(1);
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  const players = useFavoritesStore((state) => state.players);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(players.includes(player.id));
  }, [players, player.id]);

  const handleFollowClick = () => {
    toggleFavorite("players", player.id);
    setIsFollowing(!isFollowing);
  };

  const {
    displayName,
    image,
    position,
    detailedPosition,
    dateOfBirth,
    age,
    height,
    weight,
    nationality,
    currentTeam,
    preferredFoot,
    marketValue,
  } = player;

  const displayPosition = detailedPosition || position || "Player";
  const posCoords = positionCoordinates[displayPosition] ||
    positionCoordinates[position || ""] || { top: "50%", left: "50%" };

  return (
    <Card className="overflow-hidden py-0">
      {/* Header with gradient background based on team colors */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Player Photo */}
            <div className="shrink-0 flex justify-center sm:justify-start">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-lg overflow-hidden bg-slate-700/50 ring-2 ring-white/10">
                {image ? (
                  <Image
                    src={image}
                    alt={displayName}
                    fill
                    sizes="112px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400">
                    <span className="text-4xl font-bold">
                      {displayName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Player Name & Team */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {displayName}
              </h1>

              {/* Current Team */}
              {currentTeam && (
                <Link
                  href={getTeamUrl(currentTeam.teamName, currentTeam.teamId)}
                  className="inline-flex items-center gap-2 mt-1 text-slate-300 hover:text-white transition-colors"
                >
                  {currentTeam.teamLogo && (
                    <Image
                      src={currentTeam.teamLogo}
                      alt={currentTeam.teamName}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  )}
                  <span className="text-sm">{currentTeam.teamName}</span>
                </Link>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleFollowClick}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all",
                  isFollowing
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "bg-slate-700 hover:bg-slate-600 text-white"
                )}
              >
                <Star className={cn("h-4 w-4", isFollowing && "fill-current")} />
                <span className="hidden sm:inline">
                  {isFollowing ? "Following" : "Follow"}
                </span>
              </button>
              <button
                className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors text-white"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
              <button
                className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors text-white"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Position Pitch Visualization */}
            <div className="hidden md:flex flex-col items-center gap-2">
              <span className="text-xs text-slate-400">Position</span>
              <div className="relative w-28 h-36 rounded-md overflow-hidden border border-slate-600/50">
                {/* Pitch background */}
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/30 to-emerald-800/30">
                  {/* Center circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-slate-500/30" />
                  {/* Center line */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-500/30" />
                  {/* Goal areas */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 border-b border-l border-r border-slate-500/30" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-6 border-t border-l border-r border-slate-500/30" />
                  {/* Penalty areas */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-10 border-b border-l border-r border-slate-500/30" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-10 border-t border-l border-r border-slate-500/30" />
                </div>

                {/* Position marker */}
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ top: posCoords.top, left: posCoords.left }}
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-lg">
                    {getPositionAbbreviation(displayPosition)}
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-300">{displayPosition}</span>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Stats Grid */}
      <CardContent className="p-0">
        <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-border">
          {/* Height */}
          <div className="p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold">
              {height ? `${height}` : "-"}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              Height (cm)
            </p>
          </div>

          {/* Weight */}
          <div className="p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold">
              {weight ? `${weight}` : "-"}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              Weight (kg)
            </p>
          </div>

          {/* Jersey Number */}
          <div className="p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold">
              {currentTeam?.jerseyNumber || "-"}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              Number
            </p>
          </div>

          {/* Age */}
          <div className="p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold">{age || "-"}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              Age
            </p>
          </div>

          {/* Preferred Foot */}
          <div className="p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold">
              {formatPreferredFoot(preferredFoot)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              Foot
            </p>
          </div>

          {/* Market Value */}
          <div className="p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold text-green-600">
              {formatMarketValue(marketValue)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              Value
            </p>
          </div>
        </div>

        {/* Mobile: Nationality + Position Badge */}
        <div className="p-3 border-t border-border flex items-center justify-between">
          {/* Nationality */}
          <div className="flex items-center gap-1.5">
            {nationality?.flag && (
              <Image
                src={nationality.flag}
                alt={nationality.name}
                width={20}
                height={14}
                className="object-contain rounded-sm"
              />
            )}
            <span className="text-sm text-muted-foreground">
              {nationality?.name || "-"}
            </span>
          </div>

          {/* Position Badge (visible on all screens) */}
          <div className="md:hidden flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {getPositionAbbreviation(displayPosition)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {displayPosition}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
