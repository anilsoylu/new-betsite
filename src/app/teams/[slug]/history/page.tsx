import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeamById } from "@/lib/api/cached-football-api";
import { extractTeamId } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import type { TeamTrophy } from "@/types/football";
import { SITE, SEO } from "@/lib/constants";

interface TeamHistoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TeamHistoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const teamId = extractTeamId(slug);

  if (!teamId) {
    return { title: "Team Not Found" };
  }

  try {
    const team = await getTeamById(teamId);
    return {
      title: SEO.teamHistory.titleTemplate(team.name),
      description: SEO.teamHistory.descriptionTemplate(team.name),
      alternates: {
        canonical: `${SITE.url}/teams/${slug}/history`,
      },
    };
  } catch {
    return { title: "Team Not Found" };
  }
}

export default async function TeamHistoryPage({
  params,
}: TeamHistoryPageProps) {
  const { slug } = await params;
  const teamId = extractTeamId(slug);

  if (!teamId) {
    notFound();
  }

  let team;
  try {
    team = await getTeamById(teamId);
  } catch {
    notFound();
  }

  // Filter only winning trophies (position === 1) with valid league names
  const winningTrophies = team.trophies.filter(
    (t) =>
      t.position === 1 &&
      t.leagueName &&
      t.leagueName !== "Competition" &&
      t.leagueName.trim() !== "",
  );

  // Group trophies by league
  const trophiesByLeague = groupTrophiesByLeague(winningTrophies);

  const hasTrophies = winningTrophies.length > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">History & Achievements</h2>
      </div>

      {/* Club Information Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Club Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.founded && (
              <div>
                <p className="text-sm text-muted-foreground">Founded</p>
                <p className="font-medium">{team.founded}</p>
              </div>
            )}
            {team.country && (
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-medium">{team.country.name}</p>
              </div>
            )}
            {team.venue && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Stadium</p>
                  <p className="font-medium">{team.venue.name}</p>
                </div>
                {team.venue.capacity && (
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium">
                      {team.venue.capacity.toLocaleString()}
                    </p>
                  </div>
                )}
                {team.venue.city && (
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{team.venue.city}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trophy Cabinet */}
      {hasTrophies ? (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Trophy Cabinet
              </CardTitle>
              <Badge variant="secondary" className="text-sm">
                {winningTrophies.length} Won
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {Object.entries(trophiesByLeague)
              .sort(([, a], [, b]) => b.length - a.length)
              .map(([leagueName, trophies]) => (
                <div key={leagueName} className="space-y-4">
                  {/* League Header */}
                  <div className="flex items-center gap-3">
                    {trophies[0].leagueLogo ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={trophies[0].leagueLogo} />
                        <AvatarFallback className="text-xs bg-muted">
                          {leagueName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{leagueName}</h3>
                      <Badge
                        variant="outline"
                        className="text-xs text-yellow-600 border-yellow-500/30"
                      >
                        {trophies.length}x Winner
                      </Badge>
                    </div>
                  </div>

                  {/* Trophy Cards Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {trophies
                      .sort((a, b) => b.seasonId - a.seasonId)
                      .map((trophy) => (
                        <TrophyCard key={trophy.id} trophy={trophy} />
                      ))}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <Trophy className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">No Trophies Found</h3>
                <p className="text-muted-foreground max-w-md">
                  No trophy records are available for {team.name} at this time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Competitions */}
      {team.activeSeasons.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Current Competitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {team.activeSeasons.map((season) => (
                <div
                  key={season.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {season.league?.logo && (
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={season.league.logo} />
                        <AvatarFallback className="text-[8px]">
                          {season.league.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <span className="font-medium">
                      {season.league?.name || season.name}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {season.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TrophyCard({ trophy }: { trophy: TeamTrophy }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-b from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
      <Trophy className="h-6 w-6 text-yellow-500 mb-2" />
      <span className="text-xs font-medium text-center leading-tight">
        {trophy.seasonName}
      </span>
    </div>
  );
}

function groupTrophiesByLeague(
  trophies: TeamTrophy[],
): Record<string, TeamTrophy[]> {
  return trophies.reduce(
    (acc, trophy) => {
      const league = trophy.leagueName;
      if (!acc[league]) {
        acc[league] = [];
      }
      acc[league].push(trophy);
      return acc;
    },
    {} as Record<string, TeamTrophy[]>,
  );
}
