"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Star } from "lucide-react";
import { cn, getFixtureUrl } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useLiveFixture } from "@/hooks";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Fixture } from "@/types/football";

interface MatchRowProps {
  fixture: Fixture;
  showFavorites?: boolean;
}

export function MatchRow({ fixture, showFavorites = true }: MatchRowProps) {
  const { homeTeam, awayTeam, startTime, id: fixtureId } = fixture;

  // Use selectors for proper reactivity
  const favoriteMatches = useFavoritesStore((state) => state.matches);
  const favoriteTeams = useFavoritesStore((state) => state.teams);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const [hasMounted, setHasMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Poll for live fixture updates
  const liveData = useLiveFixture({ fixture, pollInterval: 30000 });
  const { status, displayMinute, homeScore, awayScore, isLive } = liveData;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Format time only on client to avoid hydration mismatch (server vs user timezone)
  const formattedTime = hasMounted
    ? format(new Date(startTime), "HH:mm")
    : "--:--";

  // Only check favorites after mount - using selector values for reactivity
  const isHomeFavorite = hasMounted && favoriteTeams.includes(homeTeam.id);
  const isAwayFavorite = hasMounted && favoriteTeams.includes(awayTeam.id);
  const isMatchFavorite = hasMounted && favoriteMatches.includes(fixtureId);
  const hasFavoriteTeam = isHomeFavorite || isAwayFavorite;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    toggleFavorite("matches", fixtureId);
    setTimeout(() => setIsAnimating(false), 400);
  };

  // Status display - using shared StatusBadge component
  const renderStatus = () => (
    <StatusBadge
      status={status}
      isLive={isLive}
      displayMinute={displayMinute}
      formattedTime={formattedTime}
      variant="compact"
    />
  );

  return (
    <Link href={getFixtureUrl(fixture)}>
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all",
          "hover:bg-muted/50 active:scale-[0.99]",
          status === "halftime" && "bg-orange-500/5",
          isLive && status !== "halftime" && "bg-red-500/5",
          !isLive &&
            status !== "halftime" &&
            (hasFavoriteTeam || isMatchFavorite) &&
            "bg-yellow-500/5",
        )}
      >
        {/* Status / Time */}
        {renderStatus()}

        {/* Home Team */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {homeTeam.logo ? (
            <Image
              src={homeTeam.logo}
              alt={homeTeam.name}
              width={20}
              height={20}
              className="object-contain shrink-0"
            />
          ) : (
            <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[10px] font-semibold shrink-0">
              {homeTeam.name.charAt(0)}
            </div>
          )}
          <span
            className={cn(
              "text-sm truncate",
              homeTeam.isWinner
                ? "font-semibold text-foreground"
                : "text-muted-foreground",
            )}
          >
            {homeTeam.name}
          </span>
        </div>

        {/* Score */}
        {isLive || status === "finished" || status === "halftime" ? (
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={cn(
                "text-sm font-bold w-5 text-center tabular-nums",
                homeTeam.isWinner ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {homeScore}
            </span>
            <span className="text-muted-foreground/50">-</span>
            <span
              className={cn(
                "text-sm font-bold w-5 text-center tabular-nums",
                awayTeam.isWinner ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {awayScore}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-sm text-muted-foreground/50 w-5 text-center">
              -
            </span>
            <span className="text-muted-foreground/50">-</span>
            <span className="text-sm text-muted-foreground/50 w-5 text-center">
              -
            </span>
          </div>
        )}

        {/* Away Team */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span
            className={cn(
              "text-sm truncate text-right",
              awayTeam.isWinner
                ? "font-semibold text-foreground"
                : "text-muted-foreground",
            )}
          >
            {awayTeam.name}
          </span>
          {awayTeam.logo ? (
            <Image
              src={awayTeam.logo}
              alt={awayTeam.name}
              width={20}
              height={20}
              className="object-contain shrink-0"
            />
          ) : (
            <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[10px] font-semibold shrink-0">
              {awayTeam.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Favorite Star */}
        {showFavorites && (
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "p-1.5 rounded-full transition-all shrink-0",
              "hover:bg-muted active:scale-90",
              isMatchFavorite ? "text-yellow-500" : "text-muted-foreground/30",
            )}
          >
            <Star
              className={cn(
                "h-4 w-4 transition-transform",
                isMatchFavorite && "fill-yellow-500",
                isAnimating && "animate-star-pop",
              )}
            />
          </button>
        )}
      </div>
    </Link>
  );
}
