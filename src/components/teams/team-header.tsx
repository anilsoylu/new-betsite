"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Calendar, Trophy, Star, Bell, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import type { TeamDetail } from "@/types/football";

interface TeamHeaderProps {
  team: TeamDetail;
}

export function TeamHeader({ team }: TeamHeaderProps) {
  const teams = useFavoritesStore((state) => state.teams);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(teams.includes(team.id));
  }, [teams, team.id]);

  const handleFollowClick = () => {
    toggleFavorite("teams", team.id);
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border border-border">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--primary)_1px,_transparent_1px)] bg-[length:20px_20px]" />
      </div>

      <div className="relative p-6">
        <div className="flex items-start gap-5">
          {/* Team Logo */}
          <div className="shrink-0">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white shadow-lg flex items-center justify-center p-3">
              {team.logo ? (
                <Image
                  src={team.logo}
                  alt={team.name}
                  width={72}
                  height={72}
                  className="object-contain"
                  priority
                />
              ) : (
                <span className="text-4xl font-bold text-muted-foreground">
                  {team.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          {/* Team Info */}
          <div className="flex-1 min-w-0">
            {/* Country */}
            {team.country && (
              <div className="flex items-center gap-2 mb-1">
                {team.country.flag && (
                  <Image
                    src={team.country.flag}
                    alt={team.country.name}
                    width={20}
                    height={14}
                    className="object-contain rounded-sm"
                  />
                )}
                <span className="text-sm text-muted-foreground">
                  {team.country.name}
                </span>
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              {team.name}
            </h1>

            {/* Badges & Info */}
            <div className="flex flex-wrap items-center gap-2">
              {team.shortCode && (
                <Badge variant="outline">{team.shortCode}</Badge>
              )}
              {team.founded && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                  <Calendar className="h-3 w-3" />
                  Est. {team.founded}
                </span>
              )}
              {team.venue && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                  <MapPin className="h-3 w-3" />
                  {team.venue.name}
                </span>
              )}
              {team.coach && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                  Manager: {team.coach.displayName}
                </span>
              )}
            </div>

            {/* Active Competitions */}
            {team.activeSeasons.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                {team.activeSeasons.slice(0, 4).map((season) => (
                  <Badge key={season.id} variant="secondary" className="text-xs">
                    {season.league?.name || season.name}
                  </Badge>
                ))}
                {team.activeSeasons.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{team.activeSeasons.length - 4} more
                  </Badge>
                )}
              </div>
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
                  : "bg-muted hover:bg-muted/80 text-foreground"
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
