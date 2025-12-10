"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { LeagueSection } from "@/components/home/league-section";
import { MatchRow } from "@/components/home/match-row";
import { useFavoritesStore } from "@/stores/favorites-store";
import type { Fixture, LeagueCategory } from "@/types/football";

interface MatchesContentProps {
  fixtures: Fixture[];
  liveFixtures: Fixture[];
  formattedDate: string;
}

interface GroupedFixtures {
  [leagueId: string]: {
    leagueId: number;
    leagueName: string;
    leagueLogo?: string;
    countryName?: string;
    countryFlag?: string;
    fixtures: Fixture[];
    hasLive: boolean;
    category: LeagueCategory;
  };
}

export function MatchesContent({
  fixtures,
  liveFixtures,
  formattedDate,
}: MatchesContentProps) {
  const [hasMounted, setHasMounted] = useState(false);
  // Use selectors for proper reactivity
  const favoriteTeams = useFavoritesStore((state) => state.teams);
  const favoriteMatches = useFavoritesStore((state) => state.matches);
  const isFavorite = (type: "teams" | "matches", id: number) =>
    type === "teams" ? favoriteTeams.includes(id) : favoriteMatches.includes(id);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Group fixtures by league
  const groupFixturesByLeague = (
    fixtures: Fixture[],
    live: Fixture[],
  ): GroupedFixtures => {
    const allFixtures = [...live, ...fixtures];
    const liveIds = new Set(live.map((f) => f.id));

    return allFixtures.reduce((acc, fixture) => {
      const leagueId = fixture.league?.id ?? 0;
      const leagueName = fixture.league?.name ?? "Other";

      if (!acc[leagueId]) {
        acc[leagueId] = {
          leagueId,
          leagueName,
          leagueLogo: fixture.league?.logo,
          countryName: fixture.league?.country?.name,
          countryFlag: fixture.league?.country?.flag,
          fixtures: [],
          hasLive: false,
          category: fixture.league?.category ?? 5,
        };
      }

      // Avoid duplicates
      if (!acc[leagueId].fixtures.find((f) => f.id === fixture.id)) {
        acc[leagueId].fixtures.push(fixture);
        if (liveIds.has(fixture.id)) {
          acc[leagueId].hasLive = true;
        }
      }

      return acc;
    }, {} as GroupedFixtures);
  };

  const grouped = groupFixturesByLeague(fixtures, liveFixtures);

  // Sort leagues: live first, then by API category, then by fixture count
  const sortedLeagues = Object.values(grouped).sort((a, b) => {
    if (a.hasLive && !b.hasLive) return -1;
    if (!a.hasLive && b.hasLive) return 1;
    if (a.category !== b.category) return a.category - b.category;
    return b.fixtures.length - a.fixtures.length;
  });

  const totalMatches = sortedLeagues.reduce(
    (sum, l) => sum + l.fixtures.length,
    0,
  );
  const totalLive = liveFixtures.length;

  // Get favorite matches
  const allCurrentFixtures = [...liveFixtures, ...fixtures];
  const favoriteFixtures = hasMounted
    ? allCurrentFixtures.filter(
        (f) =>
          isFavorite("matches", f.id) ||
          isFavorite("teams", f.homeTeam.id) ||
          isFavorite("teams", f.awayTeam.id),
      )
    : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold">{formattedDate}</h1>
        <div className="flex items-center gap-3 text-sm mt-1">
          <span className="text-muted-foreground">
            {totalMatches} {totalMatches === 1 ? "match" : "matches"}
          </span>
          {totalLive > 0 && (
            <div className="flex items-center gap-1.5 text-red-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="font-medium">{totalLive} live</span>
            </div>
          )}
        </div>
      </div>

      {/* Favorites Section */}
      {favoriteFixtures.length > 0 && (
        <div className="border border-yellow-500/30 rounded-xl overflow-hidden bg-yellow-500/5">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-yellow-500/20">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-foreground">
              My Favorites
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              {favoriteFixtures.length}{" "}
              {favoriteFixtures.length === 1 ? "match" : "matches"}
            </span>
          </div>
          <div className="divide-y divide-yellow-500/10">
            {favoriteFixtures.map((fixture) => (
              <MatchRow
                key={`fav-${fixture.id}`}
                fixture={fixture}
                showFavorites={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* League Sections */}
      <div className="flex flex-col gap-3">
        {sortedLeagues.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No matches found for this date
          </div>
        ) : (
          sortedLeagues.map((league, index) => (
            <LeagueSection
              key={league.leagueId}
              leagueId={league.leagueId}
              leagueName={league.leagueName}
              leagueLogo={league.leagueLogo}
              countryName={league.countryName}
              countryFlag={league.countryFlag}
              fixtures={league.fixtures}
              defaultExpanded={league.hasLive || index < 5}
            />
          ))
        )}
      </div>
    </div>
  );
}
