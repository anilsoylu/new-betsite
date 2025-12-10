"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Bell, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import type { League } from "@/types/football";

interface LeagueHeaderProps {
  league: League;
  seasonName?: string;
}

export function LeagueHeader({ league, seasonName }: LeagueHeaderProps) {
  const leagues = useFavoritesStore((state) => state.leagues);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(leagues.includes(league.id));
  }, [leagues, league.id]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border border-border">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--primary)_1px,_transparent_1px)] bg-[length:20px_20px]" />
      </div>

      <div className="relative p-6">
        <div className="flex items-start gap-5">
          {/* League Logo */}
          <div className="shrink-0">
            <div className="h-20 w-20 rounded-2xl bg-white shadow-lg flex items-center justify-center p-3">
              <Image
                src={league.logo}
                alt={league.name}
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
          </div>

          {/* League Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {league.country && (
                <>
                  {league.country.flag && (
                    <Image
                      src={league.country.flag}
                      alt={league.country.name}
                      width={20}
                      height={14}
                      className="object-contain rounded-sm"
                    />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {league.country.name}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              {league.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {seasonName && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {seasonName}
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                {league.type === "league" ? "League" : league.type}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                toggleFavorite("leagues", league.id);
                setIsFollowing(!isFollowing);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all",
                isFollowing
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-muted hover:bg-muted/80 text-foreground",
              )}
            >
              <Star className={cn("h-4 w-4", isFollowing && "fill-current")} />
              <span className="hidden sm:inline">
                {isFollowing ? "Following" : "Follow"}
              </span>
            </button>
            <button
              className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
