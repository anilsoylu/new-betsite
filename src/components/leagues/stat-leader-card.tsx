"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Target,
  AlertTriangle,
  XCircle,
  Shield,
  Star,
  type LucideIcon,
} from "lucide-react";
import { cn, getPlayerUrl } from "@/lib/utils";
import type { TopScorer } from "@/types/football";

type StatType =
  | "goals"
  | "assists"
  | "yellowCards"
  | "redCards"
  | "cleanSheets"
  | "rating";

interface StatConfig {
  icon: LucideIcon;
  label: string;
  statKey: keyof TopScorer;
  color: string;
  bgColor: string;
  badgeColor: string;
}

const STAT_CONFIGS: Record<StatType, StatConfig> = {
  goals: {
    icon: Trophy,
    label: "Top Scorers",
    statKey: "goals",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    badgeColor: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  },
  assists: {
    icon: Target,
    label: "Top Assists",
    statKey: "assists",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    badgeColor: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  },
  yellowCards: {
    icon: AlertTriangle,
    label: "Yellow Cards",
    statKey: "yellowCards",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-500/10",
    badgeColor: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  },
  redCards: {
    icon: XCircle,
    label: "Red Cards",
    statKey: "redCards",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
    badgeColor: "bg-red-500/20 text-red-600 dark:text-red-400",
  },
  cleanSheets: {
    icon: Shield,
    label: "Clean Sheets",
    statKey: "goals", // API returns in goals field for clean sheets
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-500/10",
    badgeColor: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
  },
  rating: {
    icon: Star,
    label: "Top Rated",
    statKey: "goals", // API returns rating in goals/total field
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    badgeColor: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  },
};

interface StatLeaderCardProps {
  type: StatType;
  players: TopScorer[];
  className?: string;
  /** Show more players (default: 5) */
  limit?: number;
  /** Compact mode shows less info */
  compact?: boolean;
}

export function StatLeaderCard({
  type,
  players,
  className,
  limit = 5,
  compact = false,
}: StatLeaderCardProps) {
  if (players.length === 0) return null;

  const config = STAT_CONFIGS[type];
  const Icon = config.icon;
  const displayPlayers = players.slice(0, limit);

  // For rating, format as decimal (e.g., 7.82)
  const formatStat = (player: TopScorer) => {
    const value = player[config.statKey] as number;
    if (type === "rating") {
      return (value / 100).toFixed(2); // API returns 782 for 7.82
    }
    return value;
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3 border-b border-border",
          config.bgColor,
        )}
      >
        <Icon className={cn("h-4 w-4", config.color)} />
        <h3 className="font-semibold text-sm">{config.label}</h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {players.length} players
        </span>
      </div>

      {/* Players List */}
      <div className="divide-y divide-border/50">
        {displayPlayers.map((player, index) => (
          <Link
            key={player.id}
            href={getPlayerUrl(player.playerName, player.playerId)}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors group"
          >
            {/* Position Badge */}
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                index === 0 &&
                  "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
                index === 1 &&
                  "bg-gray-300/30 text-gray-600 dark:text-gray-400",
                index === 2 &&
                  "bg-amber-600/20 text-amber-700 dark:text-amber-500",
                index > 2 && "bg-muted text-muted-foreground",
              )}
            >
              {player.position}
            </div>

            {/* Player Image */}
            {!compact && (
              <div className="h-9 w-9 rounded-full overflow-hidden bg-muted shrink-0">
                {player.playerImage ? (
                  <Image
                    src={player.playerImage}
                    alt={player.playerName}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    ?
                  </div>
                )}
              </div>
            )}

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {player.playerName}
              </p>
              {!compact && (
                <div className="flex items-center gap-1.5">
                  {player.teamLogo && (
                    <Image
                      src={player.teamLogo}
                      alt={player.teamName}
                      width={12}
                      height={12}
                      className="object-contain"
                    />
                  )}
                  <span className="text-xs text-muted-foreground truncate">
                    {player.teamName}
                  </span>
                </div>
              )}
            </div>

            {/* Stat Value */}
            <div className="shrink-0">
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-full font-bold text-sm",
                  config.badgeColor,
                )}
              >
                {formatStat(player)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
