import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFixtureUrl } from "@/lib/utils";
import type { Fixture } from "@/types/football";

interface FixtureCardProps {
  fixture: Fixture;
}

export function FixtureCard({ fixture }: FixtureCardProps) {
  const { homeTeam, awayTeam, score, status, statusDetail, minute, league, isLive, startTime } =
    fixture;

  const formattedTime = format(new Date(startTime), "HH:mm");

  return (
    <Link href={getFixtureUrl(fixture)}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
      <CardContent className="p-4">
        {/* League and status row */}
        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            {league && (
              <>
                {league.logo && (
                  <Image
                    src={league.logo}
                    alt={league.name}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                )}
                <span className="truncate max-w-[150px]">{league.name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLive ? (
              <Badge variant="destructive" className="animate-pulse">
                {minute ? `${minute}'` : "LIVE"}
              </Badge>
            ) : status === "finished" ? (
              <Badge variant="secondary">FT</Badge>
            ) : status === "scheduled" ? (
              <span className="text-muted-foreground font-medium">{formattedTime}</span>
            ) : (
              <Badge variant="outline">{statusDetail}</Badge>
            )}
          </div>
        </div>

        {/* Teams and score */}
        <div className="space-y-2">
          {/* Home team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {homeTeam.logo && (
                <Image
                  src={homeTeam.logo}
                  alt={homeTeam.name}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              )}
              <span
                className={`font-medium ${homeTeam.isWinner ? "text-foreground" : "text-muted-foreground"}`}
              >
                {homeTeam.name}
              </span>
            </div>
            {score && (
              <span
                className={`font-bold text-lg tabular-nums ${homeTeam.isWinner ? "text-foreground" : "text-muted-foreground"}`}
              >
                {score.home}
              </span>
            )}
          </div>

          {/* Away team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {awayTeam.logo && (
                <Image
                  src={awayTeam.logo}
                  alt={awayTeam.name}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              )}
              <span
                className={`font-medium ${awayTeam.isWinner ? "text-foreground" : "text-muted-foreground"}`}
              >
                {awayTeam.name}
              </span>
            </div>
            {score && (
              <span
                className={`font-bold text-lg tabular-nums ${awayTeam.isWinner ? "text-foreground" : "text-muted-foreground"}`}
              >
                {score.away}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
