import Image from "next/image";
import Link from "next/link";
import { format, isValid, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/utils";
import type { PlayerMatch } from "@/types/football";

function formatMatchDate(
  dateStr: string | null | undefined,
  formatStr: string,
): string {
  if (!dateStr) return "-";
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, formatStr) : "-";
}

interface PlayerMatchesProps {
  matches: Array<PlayerMatch>;
  playerId: number;
}

function getStatusBadge(status: PlayerMatch["status"]) {
  switch (status) {
    case "live":
      return (
        <Badge variant="destructive" className="text-[10px] h-4 animate-pulse">
          LIVE
        </Badge>
      );
    case "halftime":
      return (
        <Badge variant="secondary" className="text-[10px] h-4">
          HT
        </Badge>
      );
    case "finished":
      return (
        <Badge variant="outline" className="text-[10px] h-4">
          FT
        </Badge>
      );
    default:
      return null;
  }
}

export function PlayerMatches({ matches, playerId }: PlayerMatchesProps) {
  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent matches</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recent Matches</CardTitle>
          <Badge variant="secondary" className="text-xs">
            Last {matches.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {matches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${slugify(`${match.homeTeamName}-vs-${match.awayTeamName}`)}-${match.id}`}
              className="block p-3 hover:bg-muted/30 transition-colors"
            >
              {/* Date and League */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {match.leagueLogo && (
                    <Image
                      src={match.leagueLogo}
                      alt={match.leagueName}
                      width={14}
                      height={14}
                      className="object-contain"
                    />
                  )}
                  <span className="text-[10px] text-muted-foreground truncate">
                    {match.leagueName}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {formatMatchDate(match.date, "MMM d, yyyy")}
                </span>
              </div>

              {/* Teams and Score */}
              <div className="flex items-center gap-2">
                {/* Home Team */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                  <span className="text-sm truncate text-right">
                    {match.homeTeamName}
                  </span>
                  {match.homeTeamLogo ? (
                    <Image
                      src={match.homeTeamLogo}
                      alt={match.homeTeamName}
                      width={20}
                      height={20}
                      className="object-contain shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[10px] font-medium shrink-0">
                      {match.homeTeamName.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Score */}
                <div className="flex items-center gap-1 shrink-0 min-w-[60px] justify-center">
                  {match.status === "finished" ||
                  match.status === "live" ||
                  match.status === "halftime" ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold tabular-nums w-4 text-right">
                        {match.homeScore ?? "-"}
                      </span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-sm font-bold tabular-nums w-4">
                        {match.awayScore ?? "-"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {formatMatchDate(match.date, "HH:mm")}
                    </span>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {match.awayTeamLogo ? (
                    <Image
                      src={match.awayTeamLogo}
                      alt={match.awayTeamName}
                      width={20}
                      height={20}
                      className="object-contain shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[10px] font-medium shrink-0">
                      {match.awayTeamName.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm truncate">{match.awayTeamName}</span>
                </div>
              </div>

              {/* Status Badge */}
              {getStatusBadge(match.status) && (
                <div className="flex justify-center mt-2">
                  {getStatusBadge(match.status)}
                </div>
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
