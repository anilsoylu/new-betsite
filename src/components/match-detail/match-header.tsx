"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Star,
  Bell,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getTeamUrl } from "@/lib/utils";
import { useLiveFixtureContext } from "./live-fixture-provider";
import { useFavoritesStore } from "@/stores/favorites-store";
import { FormStrip, getFormFromFixtures } from "@/components/teams/form-strip";
import type { FixtureDetail, FormFixtureData } from "@/types/football";

interface MatchHeaderProps {
  fixture: FixtureDetail;
  homeForm?: Array<FormFixtureData>;
  awayForm?: Array<FormFixtureData>;
}

export function MatchHeader({ fixture, homeForm, awayForm }: MatchHeaderProps) {
  const matches = useFavoritesStore((state) => state.matches);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(matches.includes(fixture.id));
  }, [matches, fixture.id]);

  const handleFollowClick = () => {
    toggleFavorite("matches", fixture.id);
    setIsFollowing(!isFollowing);
  };

  const {
    homeTeam,
    awayTeam,
    score,
    statusDetail,
    league,
    venue,
    startTime,
    referee,
  } = fixture;

  // Convert form data to FormStrip format
  const homeFormResults = homeForm ? getFormFromFixtures(homeForm) : [];
  const awayFormResults = awayForm ? getFormFromFixtures(awayForm) : [];
  const formattedDate = format(new Date(startTime), "dd MMM yyyy");
  const formattedTime = format(new Date(startTime), "HH:mm");

  // Get live fixture data from context (polling handled by provider)
  const { status, displayMinute, homeScore, awayScore, isLive } =
    useLiveFixtureContext();

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to matches</span>
      </Link>

      {/* League info & Actions */}
      <div className="flex items-center justify-between">
        {league && (
          <div className="flex items-center gap-3">
            {league.logo && (
              <Image
                src={league.logo}
                alt={league.name}
                width={28}
                height={28}
                className="object-contain"
              />
            )}
            <div>
              <p className="font-medium">{league.name}</p>
              {league.country && (
                <p className="text-sm text-muted-foreground">
                  {league.country.name}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
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

      {/* Main match card */}
      <Card>
        <CardContent className="p-6">
          {/* Status badge */}
          <div className="flex justify-center mb-6">
            {status === "halftime" ? (
              <Badge
                variant="secondary"
                className="text-base px-4 py-1.5 bg-amber-500/20 text-amber-600 border-amber-500/30"
              >
                HT
              </Badge>
            ) : isLive ? (
              <Badge
                variant="destructive"
                className="animate-pulse text-base px-4 py-1.5"
              >
                {displayMinute || "LIVE"}
              </Badge>
            ) : status === "finished" ? (
              <Badge variant="secondary" className="text-base px-4 py-1.5">
                FT
              </Badge>
            ) : status === "scheduled" ? (
              <Badge variant="outline" className="text-base px-4 py-1.5">
                {formattedTime}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-base px-4 py-1.5">
                {statusDetail}
              </Badge>
            )}
          </div>

          {/* Teams and score */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
            {/* Home team */}
            <div className="flex-1 text-center min-w-0">
              <Link
                href={getTeamUrl(homeTeam.name, homeTeam.id)}
                className="group inline-block w-full"
              >
                {homeTeam.logo && (
                  <Image
                    src={homeTeam.logo}
                    alt={homeTeam.name}
                    width={80}
                    height={80}
                    className="object-contain mx-auto mb-2 sm:mb-3 group-hover:scale-105 transition-transform w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
                  />
                )}
                <p
                  className={`font-semibold text-sm sm:text-base md:text-lg line-clamp-2 text-center overflow-hidden hyphens-auto group-hover:text-primary transition-colors ${
                    homeTeam.isWinner
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {homeTeam.name}
                </p>
              </Link>
              {homeFormResults.length > 0 && (
                <div className="hidden sm:flex justify-center mt-2">
                  <FormStrip form={homeFormResults} size="sm" />
                </div>
              )}
            </div>

            {/* Score */}
            <div className="text-center px-3 sm:px-4 md:px-6">
              {score ||
              isLive ||
              status === "halftime" ||
              status === "finished" ? (
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums">
                  <span
                    className={
                      homeTeam.isWinner
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {homeScore}
                  </span>
                  <span className="text-muted-foreground mx-2 sm:mx-3">-</span>
                  <span
                    className={
                      awayTeam.isWinner
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {awayScore}
                  </span>
                </div>
              ) : (
                <div className="text-2xl sm:text-3xl font-bold text-muted-foreground">
                  vs
                </div>
              )}
              {score &&
                score.halftimeHome !== null &&
                score.halftimeAway !== null && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
                    HT: {score.halftimeHome} - {score.halftimeAway}
                  </p>
                )}
            </div>

            {/* Away team */}
            <div className="flex-1 text-center min-w-0">
              <Link
                href={getTeamUrl(awayTeam.name, awayTeam.id)}
                className="group inline-block w-full"
              >
                {awayTeam.logo && (
                  <Image
                    src={awayTeam.logo}
                    alt={awayTeam.name}
                    width={80}
                    height={80}
                    className="object-contain mx-auto mb-2 sm:mb-3 group-hover:scale-105 transition-transform w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
                  />
                )}
                <p
                  className={`font-semibold text-sm sm:text-base md:text-lg line-clamp-2 text-center overflow-hidden hyphens-auto group-hover:text-primary transition-colors ${
                    awayTeam.isWinner
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {awayTeam.name}
                </p>
              </Link>
              {awayFormResults.length > 0 && (
                <div className="hidden sm:flex justify-center mt-2">
                  <FormStrip form={awayFormResults} size="sm" />
                </div>
              )}
            </div>
          </div>

          {/* Match info footer */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-6 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formattedDate} • {formattedTime}
              </span>
            </div>
            {venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {venue.name}
                  {venue.city ? `, ${venue.city}` : ""}
                </span>
              </div>
            )}
            {referee && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{referee.name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
