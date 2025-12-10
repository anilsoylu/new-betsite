import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeamById, getFixturesByTeam } from "@/lib/api/football-api";
import { extractTeamId, getFixtureUrl } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Fixture } from "@/types/football";
import { SITE, SEO } from "@/lib/constants";

interface TeamMatchesPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TeamMatchesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const teamId = extractTeamId(slug);

  if (!teamId) {
    return { title: "Team Not Found" };
  }

  try {
    const team = await getTeamById(teamId);
    return {
      title: SEO.teamMatches.titleTemplate(team.name),
      description: SEO.teamMatches.descriptionTemplate(team.name),
      alternates: {
        canonical: `${SITE.url}/teams/${slug}/matches`,
      },
    };
  } catch {
    return { title: "Team Not Found" };
  }
}

export default async function TeamMatchesPage({
  params,
}: TeamMatchesPageProps) {
  const { slug } = await params;
  const teamId = extractTeamId(slug);

  if (!teamId) {
    notFound();
  }

  let team;
  let fixtures;

  try {
    [team, fixtures] = await Promise.all([
      getTeamById(teamId),
      getFixturesByTeam(teamId, { past: 30, future: 30 }),
    ]);
  } catch {
    notFound();
  }

  const allFixtures = [
    ...fixtures.recent.map((f) => ({ ...f, isPast: true })),
    ...fixtures.upcoming.map((f) => ({ ...f, isPast: false })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  // Group fixtures by month
  const fixturesByMonth = allFixtures.reduce(
    (acc, fixture) => {
      const monthKey = format(new Date(fixture.startTime), "MMMM yyyy");
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(fixture);
      return acc;
    },
    {} as Record<string, (Fixture & { isPast: boolean })[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">All Matches</h2>
        <p className="text-sm text-muted-foreground">
          {fixtures.recent.length + fixtures.upcoming.length} matches
        </p>
      </div>

      {Object.entries(fixturesByMonth).map(([month, monthFixtures]) => (
        <Card key={month}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{month}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {monthFixtures.map((fixture) => (
                <MatchRow key={fixture.id} fixture={fixture} teamId={teamId} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {allFixtures.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No matches found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface MatchRowProps {
  fixture: Fixture;
  teamId: number;
}

function MatchRow({ fixture, teamId }: MatchRowProps) {
  const isHome = fixture.homeTeam.id === teamId;
  const isFinished = fixture.status === "finished";
  const isLive = fixture.isLive;

  // Determine result for this team
  let result: "W" | "D" | "L" | null = null;
  if (isFinished && fixture.score) {
    const teamScore = isHome ? fixture.score.home : fixture.score.away;
    const opponentScore = isHome ? fixture.score.away : fixture.score.home;

    if (teamScore > opponentScore) result = "W";
    else if (teamScore < opponentScore) result = "L";
    else result = "D";
  }

  return (
    <Link
      href={getFixtureUrl(fixture)}
      className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors"
    >
      {/* Date */}
      <div className="w-16 text-center shrink-0">
        <p className="text-sm font-medium">
          {format(new Date(fixture.startTime), "dd MMM")}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(fixture.startTime), "HH:mm")}
        </p>
      </div>

      {/* Competition Badge */}
      {fixture.league && (
        <div className="w-8 shrink-0">
          <div className="relative h-6 w-6">
            <Image
              src={fixture.league.logo}
              alt={fixture.league.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Teams */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="relative h-5 w-5 shrink-0">
            <Image
              src={fixture.homeTeam.logo}
              alt={fixture.homeTeam.name}
              fill
              className="object-contain"
            />
          </div>
          <span
            className={cn(
              "text-sm truncate",
              fixture.homeTeam.id === teamId && "font-medium",
            )}
          >
            {fixture.homeTeam.name}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="relative h-5 w-5 shrink-0">
            <Image
              src={fixture.awayTeam.logo}
              alt={fixture.awayTeam.name}
              fill
              className="object-contain"
            />
          </div>
          <span
            className={cn(
              "text-sm truncate",
              fixture.awayTeam.id === teamId && "font-medium",
            )}
          >
            {fixture.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Score or Status */}
      <div className="shrink-0 flex items-center gap-2">
        {isFinished && fixture.score ? (
          <>
            <div className="text-right w-8">
              <p className="text-sm font-medium">{fixture.score.home}</p>
              <p className="text-sm font-medium">{fixture.score.away}</p>
            </div>
            {result && (
              <Badge
                variant="outline"
                className={cn(
                  "w-5 h-5 p-0 flex items-center justify-center text-[10px] font-bold shrink-0",
                  result === "W" &&
                    "bg-green-500/10 text-green-600 border-green-500/30",
                  result === "D" &&
                    "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
                  result === "L" &&
                    "bg-red-500/10 text-red-600 border-red-500/30",
                )}
              >
                {result}
              </Badge>
            )}
          </>
        ) : isLive ? (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
            LIVE
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">
            {fixture.statusDetail}
          </span>
        )}
      </div>
    </Link>
  );
}
