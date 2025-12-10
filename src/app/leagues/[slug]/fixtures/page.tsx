import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLeaguePageData } from "@/lib/api/football-api";
import { extractLeagueId } from "@/lib/utils";
import { FixturesCard, LeagueAboutSection } from "@/components/leagues";
import { TOP_LEAGUES } from "@/components/sidebar/top-leagues";
import { SITE, SEO } from "@/lib/constants";

interface FixturesPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: FixturesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const leagueId = extractLeagueId(slug);

  const knownLeague = TOP_LEAGUES.find((l) => l.id === leagueId);
  const leagueName = knownLeague?.name || "League";

  return {
    title: SEO.leagueFixtures.titleTemplate(leagueName),
    description: SEO.leagueFixtures.descriptionTemplate(leagueName),
    alternates: {
      canonical: `${SITE.url}/leagues/${slug}/fixtures`,
    },
  };
}

export default async function FixturesPage({ params }: FixturesPageProps) {
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

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <FixturesCard
          title="Upcoming Matches"
          fixtures={data.upcomingFixtures}
          type="upcoming"
        />
        <FixturesCard
          title="Recent Results"
          fixtures={data.recentFixtures}
          type="recent"
        />
      </div>

      <LeagueAboutSection
        league={data.league}
        standings={standings}
        topScorers={data.topScorers}
        recentFixtures={data.recentFixtures}
      />
    </div>
  );
}
