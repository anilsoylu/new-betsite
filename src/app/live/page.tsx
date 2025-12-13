import type { Metadata } from "next";
import { getLiveFixtures } from "@/lib/api/cached-football-api";
import { getTopLeaguesStandings } from "@/lib/queries";
import { LiveContent } from "@/components/live/live-content";
import {
  TopLeagues,
  OtherLeagues,
  StandingsWidget,
} from "@/components/sidebar";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { SITE, SEO } from "@/lib/constants";
import {
  generateBreadcrumbSchema,
  generateLiveMatchesSchema,
} from "@/lib/seo/json-ld";
import { slugify } from "@/lib/utils";

// SEO Metadata
export const metadata: Metadata = {
  title: SEO.live.title,
  description: SEO.live.description,
  keywords: [
    "live football scores",
    "live soccer scores",
    "real-time football",
    "live match updates",
    "football live streaming",
    "live score today",
  ],
  alternates: {
    canonical: `${SITE.url}/live`,
  },
  openGraph: {
    title: SEO.live.title,
    description: SEO.live.description,
    url: `${SITE.url}/live`,
    siteName: SITE.name,
    type: "website",
    images: [
      {
        url: `${SITE.url}${SITE.defaultImage}`,
        width: 1200,
        height: 630,
        alt: "Live Football Scores",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.live.title,
    description: SEO.live.description,
    images: [`${SITE.url}${SITE.defaultImage}`],
  },
};

// Revalidate every 30 seconds for live data
export const revalidate = 30;

export default async function LivePage() {
  // Fetch live fixtures and standings in parallel
  const [liveFixtures, leagueStandings] = await Promise.all([
    getLiveFixtures().catch(() => []),
    getTopLeaguesStandings().catch(() => []),
  ]);

  // Generate structured data using centralized generators
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE.url },
    { name: "Live Scores", url: `${SITE.url}/live` },
  ]);

  // Transform fixtures for JSON-LD schema
  const fixturesForSchema = liveFixtures.map((fixture) => ({
    id: fixture.id,
    homeTeam: { name: fixture.homeTeam.name },
    awayTeam: { name: fixture.awayTeam.name },
    startTime: fixture.startTime,
    slug: `${slugify(fixture.homeTeam.name)}-vs-${slugify(fixture.awayTeam.name)}-${fixture.id}`,
    score: fixture.score,
  }));

  const liveMatchesSchema = generateLiveMatchesSchema(fixturesForSchema);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLdScript id="breadcrumb-schema" schema={breadcrumbSchema} />
      <JsonLdScript id="live-matches-schema" schema={liveMatchesSchema} />

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
              <LiveContent initialFixtures={liveFixtures} />
            </div>

            {/* Right Sidebar - Hidden on mobile */}
            <aside className="hidden md:flex flex-col gap-4">
              <StandingsWidget leagueStandings={leagueStandings} />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
