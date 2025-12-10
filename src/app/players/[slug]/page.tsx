import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlayerById } from "@/lib/api/cached-football-api";
import { getTopLeaguesStandings } from "@/lib/queries";
import { extractPlayerId } from "@/lib/utils";
import {
  PlayerHeader,
  PlayerCurrentSeason,
  PlayerDataTabs,
  PlayerTrophies,
  PlayerMatches,
  PlayerCareer,
  PlayerAboutSection,
  PlayerAttributes,
} from "@/components/players";
import { StandingsWidget } from "@/components/sidebar";
import { SITE, SEO } from "@/lib/constants";
import { JsonLdScript } from "@/components/seo";
import {
  generatePersonSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/json-ld";

interface PlayerDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PlayerDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const playerId = extractPlayerId(slug);

  if (!playerId) {
    return { title: "Player Not Found" };
  }

  try {
    const player = await getPlayerById(playerId);

    return {
      title: SEO.playerDetail.titleTemplate(player.displayName),
      description: SEO.playerDetail.descriptionTemplate(
        player.displayName,
        player.position || "Football Player",
        player.currentTeam?.teamName || "Free Agent",
      ),
      alternates: {
        canonical: `${SITE.url}/players/${slug}`,
      },
      openGraph: {
        title: SEO.playerDetail.titleTemplate(player.displayName),
        description: SEO.playerDetail.descriptionTemplate(
          player.displayName,
          player.position || "Football Player",
          player.currentTeam?.teamName || "Free Agent",
        ),
        images: player.image ? [{ url: player.image }] : undefined,
      },
    };
  } catch {
    return { title: "Player Not Found" };
  }
}

export default async function PlayerDetailPage({
  params,
}: PlayerDetailPageProps) {
  const { slug } = await params;
  const playerId = extractPlayerId(slug);

  if (!playerId) {
    notFound();
  }

  // Fetch player and standings in parallel
  const [player, leagueStandings] = await Promise.all([
    getPlayerById(playerId).catch(() => null),
    getTopLeaguesStandings().catch(() => []),
  ]);

  if (!player) {
    notFound();
  }

  // Generate structured data
  const personSchema = generatePersonSchema(player);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE.url },
    { name: "Players", url: `${SITE.url}/players` },
    { name: player.displayName, url: `${SITE.url}/players/${slug}` },
  ]);

  return (
    <main className="flex-1 overflow-auto">
      <JsonLdScript id="person-schema" schema={personSchema} />
      <JsonLdScript id="breadcrumb-schema" schema={breadcrumbSchema} />

      <div className="container mx-auto px-4 py-4">
        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Content */}
          <div className="min-w-0 space-y-6">
            {/* Player Header */}
            <PlayerHeader player={player} />

            {/* Current Season Stats */}
            {player.seasonStats?.[0] && (
              <PlayerCurrentSeason stats={player.seasonStats[0]} />
            )}

            {/* Stats & Transfers Tabs */}
            <PlayerDataTabs
              stats={player.seasonStats}
              transfers={player.transfers}
            />

            {/* About Section - SEO Content */}
            <PlayerAboutSection player={player} />
          </div>

          {/* Right Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4">
            {/* Attribute Overview */}
            <PlayerAttributes player={player} />

            {/* Career History - All clubs */}
            <PlayerCareer
              teams={player.teams}
              seasonStats={player.seasonStats}
              currentTeamId={player.currentTeam?.teamId}
            />

            {/* Trophies */}
            <PlayerTrophies trophies={player.trophies} />

            {/* Recent Matches */}
            <PlayerMatches
              matches={player.recentMatches}
              playerId={player.id}
            />

            {/* Standings Widget */}
            <StandingsWidget leagueStandings={leagueStandings} />
          </aside>
        </div>
      </div>
    </main>
  );
}
