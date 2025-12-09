import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPlayerById } from "@/lib/api/football-api"
import { extractPlayerId } from "@/lib/utils"
import { PlayerHeader } from "@/components/players/player-header"
import { PlayerCareer } from "@/components/players/player-career"
import { SITE } from "@/lib/constants"

interface PlayerDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PlayerDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const playerId = extractPlayerId(slug)

  if (!playerId) {
    return { title: "Player Not Found" }
  }

  try {
    const player = await getPlayerById(playerId)

    return {
      title: `${player.displayName} | ${SITE.name}`,
      description: `${player.displayName} profile, statistics and career history. ${player.position || ""} ${player.currentTeam?.teamName ? `at ${player.currentTeam.teamName}` : ""}`.trim(),
      openGraph: {
        title: `${player.displayName} | ${SITE.name}`,
        description: `${player.displayName} profile and career history.`,
        images: player.image ? [{ url: player.image }] : undefined,
      },
    }
  } catch {
    return { title: "Player Not Found" }
  }
}

export default async function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  const { slug } = await params
  const playerId = extractPlayerId(slug)

  if (!playerId) {
    notFound()
  }

  let player
  try {
    player = await getPlayerById(playerId)
  } catch {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Player Header */}
      <PlayerHeader player={player} />

      {/* Content Grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Career History (2/3 width) */}
        <div className="lg:col-span-2">
          <PlayerCareer teams={player.teams} />
        </div>

        {/* Stats Sidebar (1/3 width) - placeholder for future */}
        <div className="space-y-6">
          {/* Can add player statistics here in future */}
        </div>
      </div>
    </main>
  )
}
