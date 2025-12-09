import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { FixtureDetail } from "@/types/football";

interface MatchHeaderProps {
  fixture: FixtureDetail;
}

export function MatchHeader({ fixture }: MatchHeaderProps) {
  const { homeTeam, awayTeam, score, status, statusDetail, minute, league, venue, isLive, startTime } = fixture;
  const formattedDate = format(new Date(startTime), "dd MMM yyyy");
  const formattedTime = format(new Date(startTime), "HH:mm");

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
              className="object-contain"
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
            {isLive ? (
              <Badge variant="destructive" className="animate-pulse text-base px-4 py-1.5">
                {minute ? `${minute}'` : "LIVE"}
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
            <div className="flex-1 text-center">
              {homeTeam.logo && (
                <Image
                  src={homeTeam.logo}
                  alt={homeTeam.name}
                  width={80}
                  height={80}
                  className="object-contain mx-auto mb-3"
                />
              )}
              <p className={`font-semibold text-lg ${homeTeam.isWinner ? "text-foreground" : "text-muted-foreground"}`}>
                {homeTeam.name}
              </p>
            </div>

            {/* Score */}
            <div className="text-center px-6">
              {score ? (
                <div className="text-5xl font-bold tabular-nums">
                  <span className={homeTeam.isWinner ? "text-foreground" : "text-muted-foreground"}>
                    {score.home}
                  </span>
                  <span className="text-muted-foreground mx-3">-</span>
                  <span className={awayTeam.isWinner ? "text-foreground" : "text-muted-foreground"}>
                    {score.away}
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
            <div className="flex-1 text-center">
              {awayTeam.logo && (
                <Image
                  src={awayTeam.logo}
                  alt={awayTeam.name}
                  width={80}
                  height={80}
                  className="object-contain mx-auto mb-3"
                />
              )}
              <p className={`font-semibold text-lg ${awayTeam.isWinner ? "text-foreground" : "text-muted-foreground"}`}>
                {awayTeam.name}
              </p>
            </div>
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
