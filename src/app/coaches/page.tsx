import { ChevronRight, Search, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  OtherLeagues,
  StandingsWidget,
  TopLeagues,
} from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getTeamById } from "@/lib/api/football-api";
import { SITE } from "@/lib/constants";
import {
  getTeamsForPopularLeagues,
  getTopLeaguesStandings,
} from "@/lib/queries";
import { getCoachUrl, getTeamUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Football Managers & Coaches | ${SITE.name}`,
  description:
    "Discover football managers and coaches worldwide. View career history, trophies, and current teams from top leagues.",
  alternates: {
    canonical: `${SITE.url}/coaches`,
  },
};

// Fetch a few teams from each league to get coach data
// Using a subset to avoid too many API calls
async function getCoachesFromTeams() {
  const leagueTeams = await getTeamsForPopularLeagues();

  // Get top 3 teams from each league (to limit API calls)
  const teamIds: Array<{
    teamId: number;
    leagueId: number;
    leagueName: string;
    leagueLogo: string;
  }> = [];

  for (const league of leagueTeams.slice(0, 4)) {
    // Top 4 leagues only
    for (const team of league.teams.slice(0, 4)) {
      // Top 4 teams per league
      teamIds.push({
        teamId: team.id,
        leagueId: league.leagueId,
        leagueName: league.leagueName,
        leagueLogo: league.leagueLogo,
      });
    }
  }

  // Fetch team details in parallel (with coach info)
  const teamDetails = await Promise.all(
    teamIds.map(({ teamId, leagueId, leagueName, leagueLogo }) =>
      getTeamById(teamId)
        .then((team) => ({
          team,
          leagueId,
          leagueName,
          leagueLogo,
        }))
        .catch(() => null),
    ),
  );

  // Group by league
  const coachesByLeague = new Map<
    number,
    {
      leagueId: number;
      leagueName: string;
      leagueLogo: string;
      coaches: Array<{
        id: number;
        name: string;
        displayName: string;
        image: string | null;
        teamId: number;
        teamName: string;
        teamLogo: string;
      }>;
    }
  >();

  for (const result of teamDetails) {
    if (!result) continue; // Ensure result is not null from the catch block

    const { team, leagueId, leagueName, leagueLogo } = result;
    if (!team.coach) continue; // Narrow the type of team.coach here

    const coach = team.coach; // coach is now correctly inferred as CoachDetail

    let leagueData = coachesByLeague.get(leagueId);
    if (!leagueData) {
      leagueData = {
        leagueId,
        leagueName,
        leagueLogo,
        coaches: [],
      };
      coachesByLeague.set(leagueId, leagueData);
    }

    leagueData.coaches.push({
      id: coach.id,
      name: coach.name,
      displayName: coach.displayName,
      image: coach.image,
      teamId: team.id,
      teamName: team.name,
      teamLogo: team.logo,
    });
  }

  return Array.from(coachesByLeague.values());
}

export default async function CoachesPage() {
  // Fetch coaches and standings in parallel
  const [leagueCoaches, leagueStandings] = await Promise.all([
    getCoachesFromTeams().catch(() => []),
    getTopLeaguesStandings().catch(() => []),
  ]);

  const totalCoaches = leagueCoaches.reduce(
    (sum, league) => sum + league.coaches.length,
    0,
  );

  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-4">
        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4">
            <TopLeagues />
            <OtherLeagues />
          </aside>

          {/* Center Content */}
          <div className="min-w-0">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Football Managers</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {totalCoaches} managers from {leagueCoaches.length} leagues
              </p>
            </div>

            {/* Search Hint */}
            <div className="mb-6 p-4 rounded-xl border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Search for any coach</p>
                  <p className="text-xs text-muted-foreground">
                    Press{" "}
                    <kbd className="inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
                      ⌘K
                    </kbd>{" "}
                    or use the search in header
                  </p>
                </div>
              </div>
            </div>

            {/* League Managers */}
            <div className="space-y-6">
              {leagueCoaches.map((league) => (
                <Card key={league.leagueId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/leagues/${league.leagueName.toLowerCase().replace(/\s+/g, "-")}-${league.leagueId}`}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                      >
                        <Image
                          src={league.leagueLogo}
                          alt={league.leagueName}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                        <h2 className="text-base group-hover:text-primary transition-colors leading-none font-semibold">
                          {league.leagueName}
                        </h2>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        Managers
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {league.coaches.map((coach) => (
                        <div
                          key={coach.id}
                          className="relative flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          {/* Main Card Link (Coach Profile) */}
                          <Link
                            href={getCoachUrl(coach.displayName, coach.id)}
                            className="absolute inset-0 z-0"
                          >
                            <span className="sr-only">
                              View {coach.displayName}'s profile
                            </span>
                          </Link>

                          {/* Coach Image */}
                          <div className="relative z-10 pointer-events-none">
                            {coach.image ? (
                              <Image
                                src={coach.image}
                                alt={coach.displayName}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                                {coach.displayName.charAt(0)}
                              </div>
                            )}
                          </div>

                          {/* Coach Info */}
                          <div className="flex-1 min-w-0 relative z-10 pointer-events-none">
                            <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {coach.displayName}
                            </h3>
                            <Link
                              href={getTeamUrl(coach.teamName, coach.teamId)}
                              className="flex items-center gap-1.5 hover:underline pointer-events-auto w-fit mt-0.5"
                            >
                              <Image
                                src={coach.teamLogo}
                                alt={coach.teamName}
                                width={14}
                                height={14}
                                className="object-contain"
                              />
                              <span className="text-xs text-muted-foreground truncate">
                                {coach.teamName}
                              </span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {leagueCoaches.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No coach data available at the moment</p>
                <p className="text-sm mt-2">
                  Use the search to find coaches or browse team pages
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="hidden md:flex flex-col gap-4">
            <StandingsWidget leagueStandings={leagueStandings} />
          </aside>
        </div>
      </div>
    </main>
  );
}
