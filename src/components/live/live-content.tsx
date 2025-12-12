"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { RefreshCw, Radio, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeagueSection } from "@/components/home/league-section";
import type { Fixture, LeagueCategory } from "@/types/football";

interface LiveContentProps {
  initialFixtures: Array<Fixture>;
}

interface GroupedFixtures {
  [leagueId: string]: {
    leagueId: number;
    leagueName: string;
    leagueLogo?: string;
    countryName?: string;
    countryFlag?: string;
    fixtures: Array<Fixture>;
    category: LeagueCategory;
  };
}

export function LiveContent({ initialFixtures }: LiveContentProps) {
  const [fixtures, setFixtures] = useState<Array<Fixture>>(initialFixtures);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  // Set mounted state and initial timestamp on client
  useEffect(() => {
    setHasMounted(true);
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  const refreshFixtures = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/fixtures/live");
      if (response.ok) {
        const data = await response.json();
        setFixtures(data.fixtures || []);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Failed to refresh live fixtures:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshFixtures();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshFixtures]);

  // Group fixtures by league
  const groupFixturesByLeague = (
    fixtureList: Array<Fixture>,
  ): GroupedFixtures => {
    return fixtureList.reduce((acc, fixture) => {
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
          category: fixture.league?.category ?? 5,
        };
      }

      // Avoid duplicates
      if (!acc[leagueId].fixtures.find((f) => f.id === fixture.id)) {
        acc[leagueId].fixtures.push(fixture);
      }

      return acc;
    }, {} as GroupedFixtures);
  };

  const grouped = groupFixturesByLeague(fixtures);

  // Sort leagues by API category (priority), then by fixture count
  const sortedLeagues = Object.values(grouped).sort((a, b) => {
    if (a.category !== b.category) return a.category - b.category;
    return b.fixtures.length - a.fixtures.length;
  });

  const totalMatches = fixtures.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Page Header with H1 */}
      <header className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Live Football Scores</h1>
            {totalMatches > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-sm font-semibold text-red-500">
                  {totalMatches}
                </span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time scores and match updates
          </p>
        </div>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={refreshFixtures}
          disabled={isRefreshing}
          className="gap-2"
          aria-label="Refresh live scores"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </header>

      {/* Last Updated - Only render on client to avoid hydration mismatch */}
      {hasMounted && lastUpdated && (
        <p className="text-xs text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
      )}

      {/* League Sections */}
      <section
        className="flex flex-col gap-3"
        aria-label="Live matches by league"
      >
        {sortedLeagues.length === 0 ? (
          <div className="text-center py-16">
            <Radio className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No Live Matches
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              There are no matches being played right now. Check back later or
              browse today&apos;s fixtures.
            </p>
            <Button asChild variant="outline">
              <Link href="/matches" className="gap-2">
                <Calendar className="h-4 w-4" />
                View Today&apos;s Fixtures
              </Link>
            </Button>
          </div>
        ) : (
          sortedLeagues.map((league) => (
            <LeagueSection
              key={league.leagueId}
              leagueId={league.leagueId}
              leagueName={league.leagueName}
              leagueLogo={league.leagueLogo}
              countryName={league.countryName}
              countryFlag={league.countryFlag}
              fixtures={league.fixtures}
              defaultExpanded={true}
            />
          ))
        )}
      </section>
    </div>
  );
}
