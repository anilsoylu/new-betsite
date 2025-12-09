"use client"

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTeamUrl } from "@/lib/utils";
import { useLiveFixture } from "@/hooks";
import type { FixtureDetail } from "@/types/football";

interface MatchHeaderProps {
  fixture: FixtureDetail;
}

export function MatchHeader({ fixture }: MatchHeaderProps) {
  const { homeTeam, awayTeam, score, statusDetail, league, venue, startTime } = fixture;
  const formattedDate = format(new Date(startTime), "dd MMM yyyy");
  const formattedTime = format(new Date(startTime), "HH:mm");

  // Poll for live fixture updates
  const liveData = useLiveFixture({ fixture, pollInterval: 30000 });
  const { status, displayMinute, homeScore, awayScore, isLive } = liveData;

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

      {/* League info */}
      {league && (
        <div className="flex items-center gap-3">
          {league.logo && (
            <Image
              src={league.logo}
              alt={league.name}
              width={28}
              height={28}
              className="object-contain w-auto h-auto"
            />
          )}
          <div>
            <p className="font-medium">{league.name}</p>
            {league.country && (
              <p className="text-sm text-muted-foreground">{league.country.name}</p>
            )}
          </div>
        </div>
      )}

      {/* Main match card */}
      <Card>
        <CardContent className="p-6">
          {/* Status badge */}
          <div className="flex justify-center mb-6">
            {status === "halftime" ? (
              <Badge variant="secondary" className="text-base px-4 py-1.5 bg-amber-500/20 text-amber-600 border-amber-500/30">
                HT
              </Badge>
            ) : isLive ? (
              <Badge variant="destructive" className="animate-pulse text-base px-4 py-1.5">
                {displayMinute || "LIVE"}
              </Badge>
            ) : status === "finished" ? (
              <Badge variant="secondary" className="text-base px-4 py-1.5">FT</Badge>
            ) : status === "scheduled" ? (
              <Badge variant="outline" className="text-base px-4 py-1.5">{formattedTime}</Badge>
            ) : (
              <Badge variant="outline" className="text-base px-4 py-1.5">{statusDetail}</Badge>
            )}
          </div>

          {/* Teams and score */}
          <div className="flex items-center justify-between gap-4">
            {/* Home team */}
            <Link href={getTeamUrl(homeTeam.name, homeTeam.id)} className="flex-1 text-center group">
              {homeTeam.logo && (
                <Image
                  src={homeTeam.logo}
                  alt={homeTeam.name}
                  width={80}
                  height={80}
                  className="object-contain mx-auto mb-3 group-hover:scale-105 transition-transform"
                />
              )}
              <p className={`font-semibold text-lg group-hover:text-primary transition-colors ${homeTeam.isWinner ? "text-foreground" : "text-muted-foreground"}`}>
                {homeTeam.name}
              </p>
            </Link>

            {/* Score */}
            <div className="text-center px-6">
              {(score || isLive || status === "halftime" || status === "finished") ? (
                <div className="text-5xl font-bold tabular-nums">
                  <span className={homeTeam.isWinner ? "text-foreground" : "text-muted-foreground"}>
                    {homeScore}
                  </span>
                  <span className="text-muted-foreground mx-3">-</span>
                  <span className={awayTeam.isWinner ? "text-foreground" : "text-muted-foreground"}>
                    {awayScore}
                  </span>
                </div>
              ) : (
                <div className="text-3xl font-bold text-muted-foreground">vs</div>
              )}
              {score && score.halftimeHome !== null && score.halftimeAway !== null && (
                <p className="text-sm text-muted-foreground mt-2">
                  HT: {score.halftimeHome} - {score.halftimeAway}
                </p>
              )}
            </div>

            {/* Away team */}
            <Link href={getTeamUrl(awayTeam.name, awayTeam.id)} className="flex-1 text-center group">
              {awayTeam.logo && (
                <Image
                  src={awayTeam.logo}
                  alt={awayTeam.name}
                  width={80}
                  height={80}
                  className="object-contain mx-auto mb-3 group-hover:scale-105 transition-transform"
                />
              )}
              <p className={`font-semibold text-lg group-hover:text-primary transition-colors ${awayTeam.isWinner ? "text-foreground" : "text-muted-foreground"}`}>
                {awayTeam.name}
              </p>
            </Link>
          </div>

          {/* Match info footer */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate} • {formattedTime}</span>
            </div>
            {venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{venue.name}{venue.city ? `, ${venue.city}` : ""}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
