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
import {
  matchesDateSchema,
  safeValidateSearchParams,
} from "@/lib/validation/schemas";

import { JsonLdScript } from "@/components/seo";
import {
  generateBreadcrumbSchema,
  generateFixtureListSchema,
} from "@/lib/seo/json-ld";
import { slugify } from "@/lib/utils";

// Revalidate every 5 minutes for fixture updates
export const revalidate = 300;

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

// Generate date items for navigation (selected date is centered)
function generateDateItems(selectedDateString: string) {
  const selectedDate = parseISO(selectedDateString);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(selectedDate);
    d.setDate(selectedDate.getDate() - 3 + i);
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
  const rawParams = await searchParams;

  // Validate date parameter with Zod, fallback to today if invalid
  const validation = safeValidateSearchParams(
    matchesDateSchema,
    new URLSearchParams(rawParams.date ? { date: rawParams.date } : {}),
  );

  // Use validated date or fallback to today
  const selectedDate = validation.success && validation.data.date
    ? parseISO(validation.data.date)
    : new Date();
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

  // Generate structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE.url },
    { name: "Matches", url: `${SITE.url}/matches` },
  ]);

  // Combine all fixtures for ItemList schema
  const allFixtures = [...liveFixtures, ...nonLiveFixtures];
  const fixturesForSchema = allFixtures.slice(0, 10).map((fixture) => ({
    id: fixture.id,
    homeTeam: { name: fixture.homeTeam.name },
    awayTeam: { name: fixture.awayTeam.name },
    startTime: fixture.startTime,
    slug: `${slugify(fixture.homeTeam.name)}-vs-${slugify(fixture.awayTeam.name)}-${fixture.id}`,
    league: fixture.league ? { name: fixture.league.name } : null,
  }));

  const fixtureListSchema = generateFixtureListSchema(fixturesForSchema, {
    name: `Football Matches - ${formattedDate}`,
    description: `Football fixtures and results for ${formattedDate}`,
    maxItems: 10,
  });

  return (
    <main className="flex-1 overflow-auto">
      <JsonLdScript id="breadcrumb-schema" schema={breadcrumbSchema} />
      <JsonLdScript id="fixture-list-schema" schema={fixtureListSchema} />
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
