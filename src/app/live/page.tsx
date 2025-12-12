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
import { SITE, SEO, CACHE_PROFILES } from "@/lib/constants";

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

// JSON-LD Structured Data for Live Scores Page
function generateJsonLd(liveCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: SEO.live.title,
    description: SEO.live.description,
    url: `${SITE.url}/live`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
    },
    about: {
      "@type": "Thing",
      name: "Live Football Scores",
      description: `Currently tracking ${liveCount} live football matches`,
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Live Matches",
      numberOfItems: liveCount,
      itemListElement: {
        "@type": "ListItem",
        name: "Live Football Matches",
      },
    },
  };
}

export default async function LivePage() {
  // Fetch live fixtures and standings in parallel
  const [liveFixtures, leagueStandings] = await Promise.all([
    getLiveFixtures().catch(() => []),
    getTopLeaguesStandings().catch(() => []),
  ]);

  const jsonLd = generateJsonLd(liveFixtures.length);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLdScript id="live-page-jsonld" schema={jsonLd} />

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
