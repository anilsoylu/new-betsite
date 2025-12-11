import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import {
  getTeamById,
  getFixturesByTeam,
  getFixtureById,
  getStandingsBySeason,
  getTeamTransfers,
} from "@/lib/api/cached-football-api"
import { extractTeamId } from "@/lib/utils"
import {
  TeamTabs,
  TeamOverviewContent,
  TeamMatchesContent,
  TeamSquadContent,
  TeamStatsContent,
  TeamTransfersContent,
  TeamHistoryContent,
} from "@/components/teams"
import { SITE, SEO } from "@/lib/constants"
import type { StandingTable, TeamLineup, Standing } from "@/types/football"
import { JsonLdScript } from "@/components/seo"
import {
  generateSportsTeamSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/json-ld"

interface TeamDetailPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tab?: string }>
}

// Tab-specific SEO metadata
const TAB_SEO = {
  overview: {
    titleTemplate: (name: string) => SEO.teamDetail.titleTemplate(name),
    descriptionTemplate: (name: string, country: string) =>
      SEO.teamDetail.descriptionTemplate(name, country),
  },
  matches: {
    titleTemplate: (name: string) => SEO.teamMatches.titleTemplate(name),
    descriptionTemplate: (name: string) =>
      SEO.teamMatches.descriptionTemplate(name),
  },
  squad: {
    titleTemplate: (name: string) => SEO.teamSquad.titleTemplate(name),
    descriptionTemplate: (name: string) =>
      SEO.teamSquad.descriptionTemplate(name),
  },
  stats: {
    titleTemplate: (name: string) => SEO.teamStats.titleTemplate(name),
    descriptionTemplate: (name: string) =>
      SEO.teamStats.descriptionTemplate(name),
  },
  transfers: {
    titleTemplate: (name: string) => SEO.teamTransfers.titleTemplate(name),
    descriptionTemplate: (name: string) =>
      SEO.teamTransfers.descriptionTemplate(name),
  },
  history: {
    titleTemplate: (name: string) => SEO.teamHistory.titleTemplate(name),
    descriptionTemplate: (name: string) =>
      SEO.teamHistory.descriptionTemplate(name),
  },
} as const

type TabKey = keyof typeof TAB_SEO

export async function generateMetadata({
  params,
  searchParams,
}: TeamDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const { tab } = await searchParams
  const teamId = extractTeamId(slug)

  if (!teamId) {
    return { title: "Team Not Found" }
  }

  try {
    const team = await getTeamById(teamId)
    const activeTab = (tab as TabKey) || "overview"
    const seo = TAB_SEO[activeTab] || TAB_SEO.overview

    const title = seo.titleTemplate(team.name)
    const description =
      activeTab === "overview"
        ? TAB_SEO.overview.descriptionTemplate(
            team.name,
            team.country?.name || "International"
          )
        : (seo as { descriptionTemplate: (name: string) => string }).descriptionTemplate(team.name)

    // Build canonical URL with tab parameter if not overview
    const canonicalUrl =
      activeTab === "overview"
        ? `${SITE.url}/teams/${slug}`
        : `${SITE.url}/teams/${slug}?tab=${activeTab}`

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        images: team.logo ? [{ url: team.logo }] : undefined,
      },
    }
  } catch {
    return { title: "Team Not Found" }
  }
}

export default async function TeamDetailPage({
  params,
}: TeamDetailPageProps) {
  const { slug } = await params
  const teamId = extractTeamId(slug)

  if (!teamId) {
    notFound()
  }

  // Fetch all data in parallel for all tabs
  let team
  let fixturesForOverview
  let fixturesForMatches
  let fixturesForStats
  let allStandingsTables: StandingTable[] = []
  let lastLineup: TeamLineup | null = null
  let transfersData: { arrivals: Awaited<ReturnType<typeof getTeamTransfers>>["arrivals"]; departures: Awaited<ReturnType<typeof getTeamTransfers>>["departures"] } = {
    arrivals: [],
    departures: [],
  }
  let statsStandings: Standing[] = []

  try {
    // Primary data fetch
    const [teamData, overviewFixtures, matchesFixtures, statsFixtures, transfers] =
      await Promise.all([
        getTeamById(teamId),
        getFixturesByTeam(teamId, { past: 10, future: 10 }),
        getFixturesByTeam(teamId, { past: 30, future: 30 }),
        getFixturesByTeam(teamId, { past: 50, future: 0 }),
        getTeamTransfers(teamId),
      ])

    team = teamData
    fixturesForOverview = overviewFixtures
    fixturesForMatches = matchesFixtures
    fixturesForStats = statsFixtures
    transfersData = transfers

    // Secondary data fetch (standings, lineup)
    const allFixtures = [
      ...overviewFixtures.recent,
      ...overviewFixtures.upcoming,
    ]
    const uniqueSeasonIds = [
      ...new Set(allFixtures.map((f) => f.seasonId).filter(Boolean)),
    ] as number[]

    // Fetch standings for all seasons in parallel
    if (uniqueSeasonIds.length > 0) {
      const standingsPromises = uniqueSeasonIds.map(async (seasonId) => {
        try {
          return await getStandingsBySeason(seasonId)
        } catch {
          return []
        }
      })

      const allResults = await Promise.all(standingsPromises)
      allStandingsTables = allResults
        .flat()
        .filter((table) => table.standings.some((s) => s.teamId === teamId))
    }

    // Get standings for stats tab
    if (team.activeSeasons.length > 0) {
      try {
        const standingsTables = await getStandingsBySeason(
          team.activeSeasons[0].id
        )
        if (standingsTables.length > 0) {
          statsStandings = standingsTables[0].standings
        }
      } catch {
        // Standings not available
      }
    }

    // Fetch last lineup from most recent finished match
    const lastFinishedMatch = overviewFixtures.recent.find(
      (f) => f.status === "finished"
    )
    if (lastFinishedMatch) {
      try {
        const fixtureDetail = await getFixtureById(lastFinishedMatch.id)
        const isHome = lastFinishedMatch.homeTeam.id === teamId
        lastLineup = isHome
          ? fixtureDetail.homeLineup
          : fixtureDetail.awayLineup
      } catch {
        // Lineup not available
      }
    }
  } catch {
    notFound()
  }

  // Generate structured data
  const sportsTeamSchema = generateSportsTeamSchema(team)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE.url },
    { name: "Teams", url: `${SITE.url}/teams` },
    { name: team.name, url: `${SITE.url}/teams/${slug}` },
  ])

  return (
    <>
      <JsonLdScript id="sports-team-schema" schema={sportsTeamSchema} />
      <JsonLdScript id="breadcrumb-schema" schema={breadcrumbSchema} />

      <Suspense fallback={<TabsSkeleton />}>
        <TeamTabs
          overviewContent={
            <TeamOverviewContent
              team={team}
              slug={slug}
              fixtures={fixturesForOverview}
              allStandingsTables={allStandingsTables}
              lastLineup={lastLineup}
            />
          }
          matchesContent={
            <TeamMatchesContent fixtures={fixturesForMatches} teamId={teamId} />
          }
          squadContent={<TeamSquadContent team={team} />}
          statsContent={
            <TeamStatsContent
              fixtures={fixturesForStats.recent}
              teamId={teamId}
              standings={statsStandings}
            />
          }
          transfersContent={
            <TeamTransfersContent
              teamName={team.name}
              arrivals={transfersData.arrivals}
              departures={transfersData.departures}
            />
          }
          historyContent={<TeamHistoryContent team={team} />}
        />
      </Suspense>
    </>
  )
}

function TabsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="flex gap-1 -mb-px overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="px-4 py-3 h-10 w-24 bg-muted/50 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="h-96 bg-muted/30 rounded animate-pulse" />
    </div>
  )
}
