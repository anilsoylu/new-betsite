import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getMatchDetailData } from "@/lib/queries";
import { extractFixtureId, slugify } from "@/lib/utils";
import {
  MatchHeader,
  MatchTabs,
  OddsCard,
  MatchArticle,
  MatchQuickStats,
  TeamFormWidget,
  LeagueMiniTable,
  MatchInfoWidget,
} from "@/components/match-detail";
import { SEO, DATE_FORMATS } from "@/lib/constants";
import { AdSpace } from "@/components/sidebar";

interface MatchDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: MatchDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fixtureId = extractFixtureId(slug);

  if (!fixtureId) {
    return { title: "Match Not Found" };
  }

  try {
    const { fixture } = await getMatchDetailData(fixtureId);
    const { homeTeam, awayTeam, league, startTime } = fixture;
    const formattedDate = format(new Date(startTime), DATE_FORMATS.date);

    return {
      title: SEO.matchDetail.titleTemplate(homeTeam.name, awayTeam.name),
      description: SEO.matchDetail.descriptionTemplate(
        homeTeam.name,
        awayTeam.name,
        league?.name || "Football",
        formattedDate,
      ),
      openGraph: {
        title: SEO.matchDetail.titleTemplate(homeTeam.name, awayTeam.name),
        description: SEO.matchDetail.descriptionTemplate(
          homeTeam.name,
          awayTeam.name,
          league?.name || "Football",
          formattedDate,
        ),
      },
    };
  } catch {
    return { title: "Match Not Found" };
  }
}

export default async function MatchDetailPage({
  params,
}: MatchDetailPageProps) {
  const { slug } = await params;
  const fixtureId = extractFixtureId(slug);

  if (!fixtureId) {
    notFound();
  }

  let data;
  try {
    data = await getMatchDetailData(fixtureId);
  } catch {
    notFound();
  }

  const { fixture, standings, h2h, odds, homeForm, awayForm } = data;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Match Header */}
      <MatchHeader fixture={fixture} homeForm={homeForm} awayForm={awayForm} />

      {/* Main content grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Tabs section */}
        <div className="order-2 lg:order-1">
          <MatchTabs fixture={fixture} standings={standings} h2h={h2h} />

          {/* Match Article */}
          <MatchArticle
            fixture={fixture}
            standings={standings}
            h2h={h2h}
            homeForm={homeForm}
            awayForm={awayForm}
          />
        </div>

        {/* Sidebar */}
        <div className="order-1 lg:order-2 space-y-4">
          {/* Odds Card */}
          {odds && (
            <OddsCard
              odds={odds}
              homeTeam={fixture.homeTeam}
              awayTeam={fixture.awayTeam}
            />
          )}

          {/* Match Info */}
          <MatchInfoWidget fixture={fixture} />

          {/* Quick Stats (if match has started/finished) */}
          {fixture.statistics.length > 0 && (
            <MatchQuickStats
              statistics={fixture.statistics}
              homeTeam={fixture.homeTeam}
              awayTeam={fixture.awayTeam}
            />
          )}

          {/* Ad Space */}
          <AdSpace size="medium-rectangle" />

          {/* Team Form Comparison */}
          <TeamFormWidget
            homeTeam={fixture.homeTeam}
            awayTeam={fixture.awayTeam}
            homeForm={homeForm}
            awayForm={awayForm}
          />

          {/* Ad Space */}
          <AdSpace size="medium-rectangle" />

          {/* Mini League Table */}
          <LeagueMiniTable
            standings={standings}
            homeTeamId={fixture.homeTeam.id}
            awayTeamId={fixture.awayTeam.id}
            leagueSlug={
              fixture.league
                ? slugify(fixture.league.name) + "-" + fixture.league.id
                : undefined
            }
          />
        </div>
      </div>
    </main>
  );
}
