import type { Metadata } from "next";
import { getHomePageData, getTopLeaguesStandings } from "@/lib/queries";
import { getHomePage } from "@/lib/contentful";
import { HomeContent } from "@/components/home/home-content";
import { RichText, FaqSection } from "@/components/content";
import {
  TopLeagues,
  OtherLeagues,
  BuildXI,
  StandingsWidget,
} from "@/components/sidebar";
import { SEO, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: SEO.home.title,
  description: SEO.home.description,
  alternates: {
    canonical: SITE.url,
  },
  openGraph: {
    title: SEO.home.title,
    description: SEO.home.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.home.title,
    description: SEO.home.description,
  },
};

export default async function HomePage() {
  // Fetch all data in parallel
  const [fixturesData, homepage, leagueStandings] = await Promise.all([
    getHomePageData(),
    getHomePage(),
    getTopLeaguesStandings(),
  ]);

  const { liveFixtures, todayFixtures } = fixturesData;

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
            {/* Fixtures Section */}
            <HomeContent
              initialFixtures={todayFixtures}
              initialLiveFixtures={liveFixtures}
            />

            {/* 
            // Contentful Rich Text Content
            {homepage?.fields?.content && (
              <section className="mt-8 pt-8 border-t border-border">
                <RichText content={homepage.fields.content} />
              </section>
            )}

            // FAQ Section - Static
            <div className="mt-8 pt-8 border-t border-border">
              <FaqSection />
            </div>
            */}
          </div>

          {/* Right Sidebar - Hidden on mobile */}
          <aside className="hidden md:flex flex-col gap-4">
            <BuildXI />
            <StandingsWidget leagueStandings={leagueStandings} />
          </aside>
        </div>
      </div>
    </main>
  );
}
