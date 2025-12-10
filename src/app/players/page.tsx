import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronRight, Trophy } from "lucide-react";
import { SITE } from "@/lib/constants";
import {
  getTopScorersForPopularLeagues,
  getTopLeaguesStandings,
} from "@/lib/queries";
import { slugify } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopLeagues, OtherLeagues, StandingsWidget } from "@/components/sidebar";

export const metadata: Metadata = {
  title: `Players | ${SITE.name}`,
  description:
    "Discover top goalscorers from the best football leagues. Find player statistics, career history and more.",
};

export default async function PlayersPage() {
  // Fetch topscorers and standings in parallel
  const [leagueTopScorers, leagueStandings] = await Promise.all([
    getTopScorersForPopularLeagues(),
    getTopLeaguesStandings(),
  ]);

  const totalPlayers = leagueTopScorers.reduce(
    (sum, league) => sum + league.topScorers.length,
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
              <h1 className="text-2xl font-bold">Top Goalscorers</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {totalPlayers} players from {leagueTopScorers.length} leagues
              </p>
            </div>

            {/* Search Hint */}
            <div className="mb-6 p-4 rounded-xl border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Search for any player</p>
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

            {/* League Top Scorers */}
            <div className="space-y-6">
              {leagueTopScorers.map((league) => (
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
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {league.leagueName}
                        </CardTitle>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <Badge variant="secondary" className="text-xs">
                        <Trophy className="h-3 w-3 mr-1" />
                        Top Scorers
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {league.topScorers.map((scorer, index) => (
                        <Link
                          key={scorer.id}
                          href={`/players/${slugify(scorer.playerName)}-${scorer.playerId}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          {/* Position */}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0
                                ? "bg-yellow-500 text-yellow-950"
                                : index === 1
                                  ? "bg-gray-300 text-gray-700"
                                  : index === 2
                                    ? "bg-amber-600 text-amber-50"
                                    : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {scorer.position}
                          </div>

                          {/* Player Image */}
                          {scorer.playerImage ? (
                            <Image
                              src={scorer.playerImage}
                              alt={scorer.playerName}
                              width={36}
                              height={36}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                              {scorer.playerName.charAt(0)}
                            </div>
                          )}

                          {/* Player Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {scorer.playerName}
                            </p>
                            <div className="flex items-center gap-2">
                              {scorer.teamLogo && (
                                <Image
                                  src={scorer.teamLogo}
                                  alt={scorer.teamName}
                                  width={14}
                                  height={14}
                                  className="object-contain"
                                />
                              )}
                              <span className="text-xs text-muted-foreground truncate">
                                {scorer.teamName}
                              </span>
                            </div>
                          </div>

                          {/* Goals */}
                          <div className="text-right">
                            <p className="text-lg font-bold tabular-nums">
                              {scorer.goals}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              Goals
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {leagueTopScorers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No player data available at the moment</p>
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
