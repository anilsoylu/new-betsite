"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Trophy, Star, Bell } from "lucide-react";
import { SharePopover } from "@/components/ui/share-popover";
import { Badge } from "@/components/ui/badge";
import { cn, getCoachUrl } from "@/lib/utils";
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

      <div className="relative p-4 sm:p-6">
        {/* Actions - Mobile: Absolute top-right, Desktop: In flow */}
        <div className="absolute top-3 right-3 sm:static sm:hidden flex items-center gap-1.5">
          <button
            onClick={handleFollowClick}
            className={cn(
              "p-2 rounded-full transition-all",
              isFollowing
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-muted/80 backdrop-blur-sm hover:bg-muted text-foreground",
            )}
          >
            <Star className={cn("h-4 w-4", isFollowing && "fill-current")} />
          </button>
          <button
            className="p-2 rounded-full bg-muted/80 backdrop-blur-sm hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <SharePopover title={team.name} />
        </div>

        {/* Mobile: Centered stack, Desktop: Horizontal */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
          {/* Team Logo */}
          <div className="shrink-0">
            <div className="h-20 w-20 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-2xl bg-white shadow-lg flex items-center justify-center p-3">
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
                <span className="text-3xl sm:text-3xl md:text-4xl font-bold text-muted-foreground">
                  {team.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          {/* Team Info - Mobile: Centered, Desktop: Left aligned */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            {/* Country */}
            {team.country && (
              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mb-1">
                {team.country.flag && (
                  <Image
                    src={team.country.flag}
                    alt={team.country.name}
                    width={20}
                    height={14}
                    className="object-contain rounded-sm"
                  />
                )}
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {team.country.name}
                </span>
              </div>
            )}

            <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2">
              {team.name}
            </h1>

            {/* Short Code Badge - Always visible */}
            {team.shortCode && (
              <div className="flex justify-center sm:justify-start mb-3 sm:mb-0 sm:hidden">
                <Badge variant="outline" className="text-xs">
                  {team.shortCode}
                </Badge>
              </div>
            )}

            {/* Meta Info - Hidden on mobile, shown on tablet+ */}
            <div className="hidden sm:flex flex-wrap items-center gap-2 mt-1">
              {team.shortCode && (
                <Badge variant="outline" className="text-xs">
                  {team.shortCode}
                </Badge>
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
                <Link
                  href={getCoachUrl(team.coach.displayName, team.coach.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  Manager: {team.coach.displayName}
                </Link>
              )}
            </div>

            {/* Active Competitions */}
            {team.activeSeasons.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                {/* Mobile: Text only, no badges */}
                <span className="sm:hidden text-xs text-muted-foreground">
                  {team.activeSeasons
                    .slice(0, 3)
                    .map((s) => s.league?.name || s.name)
                    .join(" • ")}
                  {team.activeSeasons.length > 3 &&
                    ` +${team.activeSeasons.length - 3}`}
                </span>
                {/* Desktop: Badges */}
                <div className="hidden sm:flex flex-wrap gap-1.5">
                  {team.activeSeasons.slice(0, 4).map((season) => (
                    <Badge
                      key={season.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {season.league?.name || season.name}
                    </Badge>
                  ))}
                  {team.activeSeasons.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{team.activeSeasons.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={handleFollowClick}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all",
                isFollowing
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-muted hover:bg-muted/80 text-foreground",
              )}
            >
              <Star className={cn("h-4 w-4", isFollowing && "fill-current")} />
              {isFollowing ? "Following" : "Follow"}
            </button>
            <button
              className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
            <SharePopover title={team.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
