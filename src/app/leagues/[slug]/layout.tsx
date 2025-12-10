import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getLeaguePageData } from "@/lib/api/cached-football-api";
import { extractLeagueId } from "@/lib/utils";
import { LeagueHeader, LeagueNavTabs } from "@/components/leagues";

interface LeagueLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function LeagueLayout({
  children,
  params,
}: LeagueLayoutProps) {
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

  // Get season name if available
  const seasonName = data.league.currentSeasonId ? `2024/2025` : undefined;

  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Back Link */}
        <Link
          href="/leagues"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All Leagues
        </Link>

        {/* League Header */}
        <div className="mb-6">
          <LeagueHeader league={data.league} seasonName={seasonName} />
        </div>

        {/* Navigation Tabs */}
        <LeagueNavTabs slug={slug} hasStandings={hasStandings} />

        {/* Tab Content */}
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
