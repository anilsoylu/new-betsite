import { notFound } from "next/navigation"
import { getLeaguePageData } from "@/lib/api/football-api"
import { extractLeagueId } from "@/lib/utils"
import { FixturesCard, LeagueAboutSection } from "@/components/leagues"

interface FixturesPageProps {
  params: Promise<{ slug: string }>
}

export default async function FixturesPage({ params }: FixturesPageProps) {
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
  )
}
