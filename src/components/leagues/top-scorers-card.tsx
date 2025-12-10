"use client";

import Image from "next/image";
import Link from "next/link";
import { Trophy, Target } from "lucide-react";
import { cn, getPlayerUrl } from "@/lib/utils";
import type { TopScorer } from "@/types/football";

interface TopScorersCardProps {
  title: string;
  type: "goals" | "assists";
  scorers: TopScorer[];
  className?: string;
  onViewAll?: () => void;
}

export function TopScorersCard({
  title,
  type,
  scorers,
  className,
  onViewAll,
}: TopScorersCardProps) {
  if (scorers.length === 0) return null;

  const Icon = type === "goals" ? Trophy : Target;
  const statKey = type === "goals" ? "goals" : "assists";

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>

      {/* Scorers List */}
      <div className="divide-y divide-border/50">
        {scorers.slice(0, 5).map((scorer, index) => (
          <Link
            key={scorer.id}
            href={getPlayerUrl(scorer.playerName, scorer.playerId)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group"
          >
            {/* Position */}
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                index === 0 &&
                  "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
                index === 1 &&
                  "bg-gray-300/30 text-gray-600 dark:text-gray-400",
                index === 2 &&
                  "bg-amber-600/20 text-amber-700 dark:text-amber-500",
                index > 2 && "bg-muted text-muted-foreground",
              )}
            >
              {scorer.position}
            </div>

            {/* Player Image */}
            <div className="h-10 w-10 rounded-full overflow-hidden bg-muted shrink-0">
              {scorer.playerImage ? (
                <Image
                  src={scorer.playerImage}
                  alt={scorer.playerName}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  ?
                </div>
              )}
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {scorer.playerName}
              </p>
              <div className="flex items-center gap-1.5">
                {scorer.teamLogo && (
                  <Image
                    src={scorer.teamLogo}
                    alt={scorer.teamName}
                    width={14}
                    height={14}
                    className="object-contain w-[14px] h-auto"
                  />
                )}
                <span className="text-xs text-muted-foreground truncate">
                  {scorer.teamName}
                </span>
              </div>
            </div>

            {/* Stat */}
            <div className="shrink-0">
              <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
                {scorer[statKey]}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      {scorers.length > 5 && onViewAll && (
        <div className="px-4 py-2 border-t border-border bg-muted/20">
          <button
            onClick={onViewAll}
            className="text-xs text-primary hover:text-primary/80 font-medium"
          >
            View all {scorers.length} players →
          </button>
        </div>
      )}
    </div>
  );
}
