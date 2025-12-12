import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { SITE } from "@/lib/constants";
import {
  getTeamsForPopularLeagues,
  getTopLeaguesStandings,
} from "@/lib/queries";
import { slugify } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  TopLeagues,
  OtherLeagues,
  StandingsWidget,
} from "@/components/sidebar";

export const metadata: Metadata = {
  title: `Football Teams | ${SITE.name}`,
  description:
    "Discover and browse football teams from top leagues. Find team information, squad, fixtures and statistics.",
  alternates: {
    canonical: `${SITE.url}/teams`,
  },
};

export default async function TeamsPage() {
  // Fetch teams and standings in parallel
  const [leagueTeams, leagueStandings] = await Promise.all([
    getTeamsForPopularLeagues(),
    getTopLeaguesStandings(),
  ]);

  const totalTeams = leagueTeams.reduce(
    (sum, league) => sum + league.teams.length,
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
              <h1 className="text-2xl font-bold">Football Teams</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {totalTeams} teams from {leagueTeams.length} leagues
              </p>
            </div>

            {/* Search Hint */}
            <div className="mb-6 p-4 rounded-xl border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Search for any team</p>
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

            {/* League Sections */}
            <div className="space-y-6">
              {leagueTeams.map((league) => (
                <Card key={league.leagueId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/leagues/${slugify(league.leagueName)}-${league.leagueId}`}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                      >
                        <Image
                          src={league.leagueLogo}
                          alt={league.leagueName}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                        <h2 className="text-base font-semibold group-hover:text-primary transition-colors">
                          {league.leagueName}
                        </h2>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {league.teams.length} teams
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {league.teams.map((team) => (
                        <Link
                          key={team.id}
                          href={`/teams/${slugify(team.name)}-${team.id}`}
                          className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 hover:border-primary/30 transition-all group"
                        >
                          {team.logo ? (
                            <Image
                              src={team.logo}
                              alt={team.name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                              {team.shortCode?.slice(0, 2) ||
                                team.name.charAt(0)}
                            </div>
                          )}
                          <div className="text-center">
                            <p className="text-xs font-medium truncate max-w-[100px] group-hover:text-primary transition-colors">
                              {team.name}
                            </p>
                            {team.shortCode && (
                              <p className="text-[10px] text-muted-foreground">
                                {team.shortCode}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {leagueTeams.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No teams available at the moment</p>
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
