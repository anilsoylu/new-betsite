import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTeamById, getFixturesByTeam } from "@/lib/api/football-api"
import { extractTeamId } from "@/lib/utils"
import { TeamHeader } from "@/components/teams/team-header"
import { TeamSquad } from "@/components/teams/team-squad"
import { TeamFixtures } from "@/components/teams/team-fixtures"
import { SITE } from "@/lib/constants"

interface TeamDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: TeamDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const teamId = extractTeamId(slug)

  if (!teamId) {
    return { title: "Team Not Found" }
  }

  try {
    const team = await getTeamById(teamId)

    return {
      title: `${team.name} | ${SITE.name}`,
      description: `${team.name} squad, fixtures and statistics. ${team.country?.name || ""}`,
      openGraph: {
        title: `${team.name} | ${SITE.name}`,
        description: `${team.name} squad, fixtures and statistics.`,
        images: team.logo ? [{ url: team.logo }] : undefined,
      },
    }
  } catch {
    return { title: "Team Not Found" }
  }
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { slug } = await params
  const teamId = extractTeamId(slug)

  if (!teamId) {
    notFound()
  }

  let team
  let fixtures
  try {
    ;[team, fixtures] = await Promise.all([
      getTeamById(teamId),
      getFixturesByTeam(teamId, { past: 5, future: 5 }),
    ])
  } catch {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Team Header */}
      <TeamHeader team={team} />

      {/* Content Grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Squad (2/3 width) */}
        <div className="lg:col-span-2">
          <TeamSquad squad={team.squad} />
        </div>

        {/* Fixtures Sidebar (1/3 width) */}
        <div className="space-y-6">
          <TeamFixtures
            title="Recent Matches"
            fixtures={fixtures.recent}
            teamId={teamId}
            emptyMessage="No recent matches"
          />
          <TeamFixtures
            title="Upcoming Matches"
            fixtures={fixtures.upcoming}
            teamId={teamId}
            emptyMessage="No upcoming matches"
          />
        </div>
      </div>
    </main>
  )
}
