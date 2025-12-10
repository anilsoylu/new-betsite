import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE, SEO } from "@/lib/constants";
import { getLeaguePageData } from "@/lib/api/football-api";
import { extractLeagueId } from "@/lib/utils";
import { TOP_LEAGUES } from "@/components/sidebar/top-leagues";
import {
  FixturesCard,
  TopScorersCard,
  StandingsTable,
  LeagueAboutSection,
} from "@/components/leagues";
import { AdSpace } from "@/components/sidebar";
import { JsonLdScript } from "@/components/seo";
import {
  generateSportsLeagueSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/json-ld";

interface LeaguePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: LeaguePageProps): Promise<Metadata> {
  const { slug } = await params;
  const leagueId = extractLeagueId(slug);

  if (!leagueId) {
    return { title: `League | ${SITE.name}` };
  }

  const knownLeague = TOP_LEAGUES.find((l) => l.id === leagueId);

  if (knownLeague) {
    return {
      title: SEO.leagueDetail.titleTemplate(knownLeague.name),
      description: SEO.leagueDetail.descriptionTemplate(
        knownLeague.name,
        knownLeague.country
      ),
      alternates: {
        canonical: `${SITE.url}/leagues/${slug}`,
      },
    };
  }

  return {
    title: `League | ${SITE.name}`,
    description: "League standings, fixtures, and statistics.",
    alternates: {
      canonical: `${SITE.url}/leagues/${slug}`,
    },
  };
}

export default async function LeagueOverviewPage({ params }: LeaguePageProps) {
  const { slug } = await params;
  const leagueId = extractLeagueId(slug);

  if (!leagueId) {
    notFound();
  }

  let data;
  try {
    data = await getLeaguePageData(leagueId);
  } catch {
    notFound();
  }

  const hasStandings =
    data.standings.length > 0 && data.standings[0].standings.length > 0;
  const standings = hasStandings ? data.standings[0].standings : [];

  // Generate structured data
  const leagueSchema = generateSportsLeagueSchema(data.league, standings);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE.url },
    { name: "Leagues", url: `${SITE.url}/leagues` },
    { name: data.league.name, url: `${SITE.url}/leagues/${slug}` },
  ]);

  return (
    <>
      <JsonLdScript id="sports-league-schema" schema={leagueSchema} />
      <JsonLdScript id="breadcrumb-schema" schema={breadcrumbSchema} />

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      {/* Main Content */}
      <div className="space-y-6">
        {/* Live Matches */}
        {data.liveFixtures.length > 0 && (
          <FixturesCard
            title="Live Now"
            fixtures={data.liveFixtures}
            type="live"
          />
        )}

        {/* Upcoming Matches */}
        <FixturesCard
          title="Upcoming Matches"
          fixtures={data.upcomingFixtures}
          type="upcoming"
        />

        {/* Ad Space */}
        <AdSpace size="inline-banner" />

        {/* Recent Results */}
        <FixturesCard
          title="Recent Results"
          fixtures={data.recentFixtures}
          type="recent"
        />

        {/* About Section */}
        <LeagueAboutSection
          league={data.league}
          standings={standings}
          topScorers={data.topScorers}
          recentFixtures={data.recentFixtures}
        />

        {/* Mini Standings (mobile) */}
        {hasStandings && (
          <div className="lg:hidden">
            <h3 className="font-semibold mb-3">Standings</h3>
            <StandingsTable standings={standings.slice(0, 6)} compact />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block space-y-6">
        {/* Mini Standings */}
        {hasStandings && (
          <StandingsTable standings={standings.slice(0, 8)} compact />
        )}

        {/* Ad Space */}
        <AdSpace size="large-rectangle" />

        {/* Top Scorers */}
        <TopScorersCard
          title="Top Scorers"
          type="goals"
          scorers={data.topScorers}
        />

        {/* Top Assists */}
        <TopScorersCard
          title="Top Assists"
          type="assists"
          scorers={data.topAssists}
        />

        {/* Ad Space */}
        <AdSpace size="large-rectangle" />
      </div>
      </div>
    </>
  );
}
