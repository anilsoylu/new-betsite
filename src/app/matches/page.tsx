import type { Metadata } from "next";
import { format, parseISO, isToday } from "date-fns";
import {
  getFixturesByDate,
  getLiveFixtures,
} from "@/lib/api/cached-football-api";
import { getTopLeaguesStandings } from "@/lib/queries";
import { DateNavigation } from "@/components/matches/date-navigation";
import { MatchesContent } from "@/components/matches/matches-content";
import {
  TopLeagues,
  OtherLeagues,
  StandingsWidget,
} from "@/components/sidebar";
import { SITE, DATE_FORMATS } from "@/lib/constants";

export const metadata: Metadata = {
  title: `All Matches | ${SITE.name}`,
  description:
    "Browse all football matches by date. Find live scores, upcoming fixtures and match results.",
  alternates: {
    canonical: `${SITE.url}/matches`,
  },
  openGraph: {
    title: `All Matches | ${SITE.name}`,
    description:
      "Browse all football matches by date. Find live scores, upcoming fixtures and match results.",
    url: `${SITE.url}/matches`,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `All Matches | ${SITE.name}`,
    description:
      "Browse all football matches by date. Find live scores, upcoming fixtures and match results.",
  },
};

interface MatchesPageProps {
  searchParams: Promise<{ date?: string }>;
}

// Generate date items for navigation
function generateDateItems(selectedDateString: string) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 3 + i);
    const dateString = format(d, DATE_FORMATS.apiDate);
    return {
      date: d,
      dateString,
      label: format(d, "EEE"),
      dayNumber: format(d, "d"),
      isToday: isToday(d),
      isSelected: dateString === selectedDateString,
    };
  });
}

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const { date } = await searchParams;

  // Parse date from query or use today
  const selectedDate = date ? parseISO(date) : new Date();
  const dateString = format(selectedDate, DATE_FORMATS.apiDate);
  const isSelectedToday = isToday(selectedDate);

  // Generate date items for navigation
  const dates = generateDateItems(dateString);

  // Fetch fixtures and standings in parallel
  const [fixtures, liveFixtures, leagueStandings] = await Promise.all([
    getFixturesByDate(dateString).catch(() => []),
    isSelectedToday ? getLiveFixtures().catch(() => []) : Promise.resolve([]),
    getTopLeaguesStandings().catch(() => []),
  ]);

  // Filter out live fixtures from regular fixtures to avoid duplicates
  const liveIds = new Set(liveFixtures.map((f) => f.id));
  const nonLiveFixtures = fixtures.filter((f) => !liveIds.has(f.id));

  const formattedDate = format(selectedDate, "EEEE, d MMMM yyyy");

  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-4">
        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6">
          {/* Left Sidebar - Hidden on mobile/tablet */}
          <aside className="hidden lg:flex flex-col gap-4">
            <TopLeagues />
            <OtherLeagues />
          </aside>

          {/* Center Content */}
          <div className="min-w-0">
            {/* Date Navigation */}
            <DateNavigation dates={dates} />

            {/* Matches Content - Same as Homepage */}
            <div className="mt-6">
              <MatchesContent
                fixtures={nonLiveFixtures}
                liveFixtures={liveFixtures}
                formattedDate={formattedDate}
              />
            </div>
          </div>

          {/* Right Sidebar - Hidden on mobile */}
          <aside className="hidden md:flex flex-col gap-4">
            <StandingsWidget leagueStandings={leagueStandings} />
          </aside>
        </div>
      </div>
    </main>
  );
}
