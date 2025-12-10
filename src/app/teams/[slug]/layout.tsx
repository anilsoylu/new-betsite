import { notFound } from "next/navigation"
import { getTeamById, getFixturesByTeam } from "@/lib/api/cached-football-api"
import { extractTeamId } from "@/lib/utils"
import { TeamHeader, TeamNavTabs } from "@/components/teams"

interface TeamLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function TeamLayout({
  children,
  params,
}: TeamLayoutProps) {
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

  // Check data availability for conditional tabs
  // For now, we'll show all tabs and handle empty states in each page
  const hasStats = true
  const hasTransfers = true
  const hasHistory = true

  const nextMatch = fixtures.upcoming[0] || null
  const lastMatch = fixtures.recent[0] || null

  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Team Header */}
        <div className="mb-6">
          <TeamHeader team={team} />
        </div>

        {/* Navigation Tabs */}
        <TeamNavTabs
          slug={slug}
          hasStats={hasStats}
          hasTransfers={hasTransfers}
          hasHistory={hasHistory}
        />

        {/* Tab Content */}
        <div className="mt-6">{children}</div>
      </div>
    </main>
  )
}
