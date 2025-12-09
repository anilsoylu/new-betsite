import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { getMatchDetailData } from "@/lib/queries"
import { extractFixtureId } from "@/lib/utils"
import { MatchHeader, MatchTabs, OddsCard } from "@/components/match-detail"
import { SEO, DATE_FORMATS } from "@/lib/constants"

interface MatchDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: MatchDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const fixtureId = extractFixtureId(slug)

  if (!fixtureId) {
    return { title: "Match Not Found" }
  }

  try {
    const { fixture } = await getMatchDetailData(fixtureId)
    const { homeTeam, awayTeam, league, startTime } = fixture
    const formattedDate = format(new Date(startTime), DATE_FORMATS.date)

    return {
      title: SEO.matchDetail.titleTemplate(homeTeam.name, awayTeam.name),
      description: SEO.matchDetail.descriptionTemplate(
        homeTeam.name,
        awayTeam.name,
        league?.name || "Football",
        formattedDate
      ),
      openGraph: {
        title: SEO.matchDetail.titleTemplate(homeTeam.name, awayTeam.name),
        description: SEO.matchDetail.descriptionTemplate(
          homeTeam.name,
          awayTeam.name,
          league?.name || "Football",
          formattedDate
        ),
      },
    }
  } catch {
    return { title: "Match Not Found" }
  }
}

export default async function MatchDetailPage({
  params,
}: MatchDetailPageProps) {
  const { slug } = await params
  const fixtureId = extractFixtureId(slug)

  if (!fixtureId) {
    notFound()
  }

  let data
  try {
    data = await getMatchDetailData(fixtureId)
  } catch {
    notFound()
  }

  const { fixture, standings, h2h, odds } = data

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Match Header */}
      <MatchHeader fixture={fixture} />

      {/* Main content grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Tabs section */}
        <div className="order-2 lg:order-1">
          <MatchTabs fixture={fixture} standings={standings} h2h={h2h} />
        </div>

        {/* Sidebar - Odds */}
        {odds && (
          <div className="order-1 lg:order-2">
            <OddsCard
              odds={odds}
              homeTeam={fixture.homeTeam}
              awayTeam={fixture.awayTeam}
            />
          </div>
        )}
      </div>
    </main>
  )
}
