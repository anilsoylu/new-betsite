"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO, isValid } from "date-fns";
import { Star, Bell, Share2, Trophy, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getTeamUrl } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import type { CoachDetail } from "@/types/football";

interface CoachHeaderProps {
  coach: CoachDetail;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, "d MMM yyyy") : "";
}

export function CoachHeader({ coach }: CoachHeaderProps) {
  const coaches = useFavoritesStore((state) => state.coaches);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(coaches.includes(coach.id));
  }, [coaches, coach.id]);

  const handleFollowClick = () => {
    toggleFavorite("coaches", coach.id);
  };

  const {
    displayName,
    image,
    dateOfBirth,
    age,
    height,
    weight,
    nationality,
    currentTeam,
    teams: teamsManaged,
    trophies,
  } = coach;

  // Count unique teams managed
  const teamsCount = teamsManaged.filter(
    (t) => t.position === "Head Coach",
  ).length;
  // Count titles won (position 1)
  const titlesCount = trophies.filter((t) => t.position === 1).length;

  return (
    <Card className="overflow-hidden py-0">
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Coach Photo */}
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

            {/* Coach Name & Team */}
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

              {/* Role Badge */}
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs">
                  {currentTeam?.position || "Manager"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleFollowClick}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all",
                  isFollowing
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "bg-slate-700 hover:bg-slate-600 text-white",
                )}
              >
                <Star
                  className={cn("h-4 w-4", isFollowing && "fill-current")}
                />
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
          </div>
        </CardContent>
      </div>

      {/* Stats Grid */}
      <CardContent className="p-0">
        <div className="grid grid-cols-3 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-border">
          {/* Age */}
          <div className="p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold">{age || "-"}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              Age
            </p>
          </div>

          {/* Height */}
          <div className="p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold">
              {height ? `${height}` : "-"}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              Height (cm)
            </p>
          </div>

          {/* Teams Managed */}
          <div className="p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold flex items-center justify-center gap-1">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              {teamsCount || teamsManaged.length}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              Teams
            </p>
          </div>

          {/* Titles Won */}
          <div className="p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold text-yellow-600 flex items-center justify-center gap-1">
              <Trophy className="h-4 w-4" />
              {titlesCount}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              Titles
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
        </div>

        {/* Nationality */}
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

          {/* Birth Date */}
          <div className="text-sm text-muted-foreground">
            Born: {formatDate(dateOfBirth) || "-"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
