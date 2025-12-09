import { notFound } from "next/navigation"
import { getLeaguePageData } from "@/lib/api/football-api"
import { extractLeagueId } from "@/lib/utils"
import { StandingsTable, LeagueAboutSection } from "@/components/leagues"

interface StandingsPageProps {
  params: Promise<{ slug: string }>
}

export default async function StandingsPage({ params }: StandingsPageProps) {
  const { slug } = await params
  const leagueId = extractLeagueId(slug)

  if (!leagueId) {
    notFound()
  }

  let data
  try {
    data = await getLeaguePageData(leagueId)
  } catch {
    notFound()
  }

  const hasStandings =
    data.standings.length > 0 && data.standings[0].standings.length > 0
  const standings = hasStandings ? data.standings[0].standings : []

  return (
    <div className="space-y-8">
      {hasStandings ? (
        <StandingsTable standings={standings} />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No standings available for this competition
        </div>
      )}

      <LeagueAboutSection
        league={data.league}
        standings={standings}
        topScorers={data.topScorers}
        recentFixtures={data.recentFixtures}
      />
    </div>
  )
}
