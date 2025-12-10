"use client";

import { useState, useEffect, useTransition } from "react";
import { format } from "date-fns";
import { Loader2, Star } from "lucide-react";
import { DatePicker } from "./date-picker";
import { LeagueSection } from "./league-section";
import { MatchRow } from "./match-row";
import { useFavoritesStore } from "@/stores/favorites-store";
import type { Fixture, LeagueCategory } from "@/types/football";

interface HomeContentProps {
  initialFixtures: Fixture[];
  initialLiveFixtures: Fixture[];
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

export function HomeContent({
  initialFixtures,
  initialLiveFixtures,
}: HomeContentProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fixtures, setFixtures] = useState<Fixture[]>(initialFixtures);
  const [liveFixtures, setLiveFixtures] =
    useState<Fixture[]>(initialLiveFixtures);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const { isFavorite } = useFavoritesStore();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Check if selected date is today
  const isToday =
    format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  // Fetch fixtures when date changes
  const handleDateChange = async (date: Date) => {
    setSelectedDate(date);
    const dateStr = format(date, "yyyy-MM-dd");
    const todayStr = format(new Date(), "yyyy-MM-dd");

    if (dateStr === todayStr) {
      // Reset to initial data for today
      setFixtures(initialFixtures);
      setLiveFixtures(initialLiveFixtures);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/fixtures?date=${dateStr}`);
      if (response.ok) {
        const data = await response.json();
        setFixtures(data.fixtures || []);
        setLiveFixtures([]); // No live fixtures for other days
      }
    } catch (error) {
      console.error("Failed to fetch fixtures:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group fixtures by league
  const groupFixturesByLeague = (
    fixtures: Fixture[],
    live: Fixture[],
  ): GroupedFixtures => {
    const allFixtures = [...live, ...fixtures];
    const liveIds = new Set(live.map((f) => f.id));

    return allFixtures.reduce((acc, fixture) => {
      const leagueId = fixture.league?.id ?? 0;
      const leagueName = fixture.league?.name ?? "Diğer";

      if (!acc[leagueId]) {
        acc[leagueId] = {
          leagueId,
          leagueName,
          leagueLogo: fixture.league?.logo,
          countryName: fixture.league?.country?.name,
          countryFlag: fixture.league?.country?.flag,
          fixtures: [],
          hasLive: false,
          category: fixture.league?.category ?? 5, // Default to lowest priority
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

  // Sort leagues: live first, then by API category (1 = top tier), then by fixture count
  const sortedLeagues = Object.values(grouped).sort((a, b) => {
    // 1. Live matches first
    if (a.hasLive && !b.hasLive) return -1;
    if (!a.hasLive && b.hasLive) return 1;

    // 2. Sort by API category (lower = higher priority, e.g., category 1 = Premier League)
    if (a.category !== b.category) return a.category - b.category;

    // 3. More fixtures = higher priority
    return b.fixtures.length - a.fixtures.length;
  });

  const totalMatches = sortedLeagues.reduce(
    (sum, l) => sum + l.fixtures.length,
    0,
  );
  const totalLive = liveFixtures.length;

  // Get favorite matches from current fixtures
  const allCurrentFixtures = [...liveFixtures, ...fixtures];
  const favoriteMatches = hasMounted
    ? allCurrentFixtures.filter(
        (f) =>
          isFavorite("matches", f.id) ||
          isFavorite("teams", f.homeTeam.id) ||
          isFavorite("teams", f.awayTeam.id),
      )
    : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Date Picker */}
      <DatePicker
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        className="-mx-1"
      />

      {/* Favorites Section */}
      {favoriteMatches.length > 0 && (
        <div className="border border-yellow-500/30 rounded-xl overflow-hidden bg-yellow-500/5">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-yellow-500/20">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-foreground">
              My Favorites
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              {favoriteMatches.length}{" "}
              {favoriteMatches.length === 1 ? "match" : "matches"}
            </span>
          </div>
          <div className="divide-y divide-yellow-500/10">
            {favoriteMatches.map((fixture) => (
              <MatchRow
                key={`fav-${fixture.id}`}
                fixture={fixture}
                showFavorites={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Summary Bar */}
      <div className="flex items-center gap-3 text-sm">
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* League Sections */}
      {!isLoading && (
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
      )}
    </div>
  );
}
