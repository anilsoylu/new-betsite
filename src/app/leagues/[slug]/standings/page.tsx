import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLeaguePageData } from "@/lib/api/cached-football-api";
import { extractLeagueId } from "@/lib/utils";
import { StandingsTable } from "@/components/leagues";
import { TOP_LEAGUES } from "@/components/sidebar/top-leagues";
import { SITE, SEO } from "@/lib/constants";

interface StandingsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: StandingsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const leagueId = extractLeagueId(slug);

  const knownLeague = TOP_LEAGUES.find((l) => l.id === leagueId);
  const leagueName = knownLeague?.name || "League";

  return {
    title: SEO.leagueStandings.titleTemplate(leagueName),
    description: SEO.leagueStandings.descriptionTemplate(leagueName),
    alternates: {
      canonical: `${SITE.url}/leagues/${slug}/standings`,
    },
  };
}

export default async function StandingsPage({ params }: StandingsPageProps) {
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
      {hasStandings ? (
        <StandingsTable standings={standings} />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No standings available for this competition
        </div>
      )}
    </div>
  );
}
