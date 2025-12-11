import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getTeamById,
  getFixturesByTeam,
  getFixtureById,
  getStandingsBySeason,
} from "@/lib/api/cached-football-api"
import { extractTeamId, getFixtureUrl, getTeamUrl, slugify } from "@/lib/utils"
import { TeamFixtures } from "@/components/teams/team-fixtures"
import { FormStrip } from "@/components/teams/form-strip"
import { TeamPitchView } from "@/components/teams/team-pitch-view"
import { SITE, SEO } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, TrendingUp, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type {
  Standing,
  StandingTable,
  Fixture,
  TeamLineup,
} from "@/types/football"
import { JsonLdScript } from "@/components/seo"
import {
  generateSportsTeamSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/json-ld"
import { TeamAbout } from "@/components/teams/team-about"

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
      title: SEO.teamDetail.titleTemplate(team.name),
      description: SEO.teamDetail.descriptionTemplate(
        team.name,
        team.country?.name || "International"
      ),
      alternates: {
        canonical: `${SITE.url}/teams/${slug}`,
      },
      openGraph: {
        title: SEO.teamDetail.titleTemplate(team.name),
        description: SEO.teamDetail.descriptionTemplate(
          team.name,
          team.country?.name || "International"
        ),
        images: team.logo ? [{ url: team.logo }] : undefined,
      },
    }
  } catch {
    return { title: "Team Not Found" }
  }
}

// Helper to get team form from fixtures
function getFormFromFixtures(
  fixtures: Fixture[],
  teamId: number
): Array<"W" | "D" | "L"> {
  return fixtures
    .filter((f) => f.status === "finished" && f.score)
    .slice(0, 5)
    .map((f) => {
      const isHome = f.homeTeam.id === teamId
      const teamScore = isHome ? f.score!.home : f.score!.away
      const opponentScore = isHome ? f.score!.away : f.score!.home

      if (teamScore > opponentScore) return "W"
      if (teamScore < opponentScore) return "L"
      return "D"
    })
}

// Helper to find team standing
function findTeamStanding(
  standings: Standing[],
  teamId: number
): Standing | null {
  return standings.find((s) => s.teamId === teamId) || null
}

export default async function TeamOverviewPage({
  params,
}: TeamDetailPageProps) {
  const { slug } = await params
  const teamId = extractTeamId(slug)

  if (!teamId) {
    notFound()
  }

  let team
  let fixtures
  let allStandingsTables: StandingTable[] = []
  let lastLineup: TeamLineup | null = null

  try {
    ;[team, fixtures] = await Promise.all([
      getTeamById(teamId),
      getFixturesByTeam(teamId, { past: 10, future: 10 }),
    ])

    // Collect ALL unique seasonIds from fixtures to get standings for all leagues
    const allFixtures = [...fixtures.recent, ...fixtures.upcoming]
    const uniqueSeasonIds = [
      ...new Set(allFixtures.map((f) => f.seasonId).filter(Boolean)),
    ] as number[]

    // Fetch standings for all seasons in parallel
    if (uniqueSeasonIds.length > 0) {
      const standingsPromises = uniqueSeasonIds.map(async (seasonId) => {
        try {
          const tables = await getStandingsBySeason(seasonId)
          return tables
        } catch {
          return []
        }
      })

      const allResults = await Promise.all(standingsPromises)
      // Flatten and filter to only tables where this team appears
      allStandingsTables = allResults
        .flat()
        .filter((table) => table.standings.some((s) => s.teamId === teamId))
    }

    // Fetch last lineup from most recent finished match
    const lastFinishedMatch = fixtures.recent.find(
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

  const form = getFormFromFixtures(fixtures.recent, teamId)
  const nextMatch = fixtures.upcoming[0]
  const lastMatch = fixtures.recent[0]
  const secondUpcomingMatch = fixtures.upcoming[1] // For the "Upcoming Match" card in sidebar

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
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Match Card */}
          {nextMatch && (
            <Card className="overflow-hidden py-0 gap-0">
              <CardHeader className="bg-primary/5 py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Next Match
                  </CardTitle>
                  {nextMatch.league && (
                    <Badge variant="secondary">{nextMatch.league.name}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Link
                  href={getFixtureUrl(nextMatch)}
                  className="block hover:bg-muted/50 rounded-lg p-3 sm:p-4 -m-3 sm:-m-4 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 sm:gap-3">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20">
                        <Image
                          src={nextMatch.homeTeam.logo}
                          alt={nextMatch.homeTeam.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium text-center line-clamp-2 ${
                          nextMatch.homeTeam.id === teamId ? "text-primary" : ""
                        }`}
                      >
                        {nextMatch.homeTeam.name}
                      </span>
                    </div>

                    {/* Match Time */}
                    <div className="flex flex-col items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 flex-shrink-0">
                      <span className="text-xl sm:text-2xl font-bold">
                        {new Date(nextMatch.startTime).toLocaleTimeString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(nextMatch.startTime).toLocaleDateString(
                          "en-GB",
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          }
                        )}
                      </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20">
                        <Image
                          src={nextMatch.awayTeam.logo}
                          alt={nextMatch.awayTeam.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium text-center line-clamp-2 ${
                          nextMatch.awayTeam.id === teamId ? "text-primary" : ""
                        }`}
                      >
                        {nextMatch.awayTeam.name}
                      </span>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Form & Stats Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Form Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Recent Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                {form.length > 0 ? (
                  <div className="space-y-3">
                    <FormStrip form={form} size="lg" />
                    <p className="text-sm text-muted-foreground">
                      Last {form.length} matches:{" "}
                      {form.filter((r) => r === "W").length}W{" "}
                      {form.filter((r) => r === "D").length}D{" "}
                      {form.filter((r) => r === "L").length}L
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recent matches
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Match Card */}
            {secondUpcomingMatch && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Upcoming Match
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={getFixtureUrl(secondUpcomingMatch)}
                    className="block hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 shrink-0">
                          <Image
                            src={secondUpcomingMatch.homeTeam.logo}
                            alt={secondUpcomingMatch.homeTeam.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="text-xs">vs</span>
                        <div className="relative h-8 w-8 shrink-0">
                          <Image
                            src={secondUpcomingMatch.awayTeam.logo}
                            alt={secondUpcomingMatch.awayTeam.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(
                            secondUpcomingMatch.startTime
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            secondUpcomingMatch.startTime
                          ).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Squad Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Squad Overview
                </CardTitle>
                <Link
                  href={`/teams/${slug}/squad`}
                  className="text-sm text-primary hover:underline"
                >
                  View Full Squad
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {
                      team.squad.filter((p) => p.positionGroup === "Goalkeeper")
                        .length
                    }
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Goalkeepers</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {
                      team.squad.filter((p) => p.positionGroup === "Defender")
                        .length
                    }
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Defenders</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {
                      team.squad.filter((p) => p.positionGroup === "Midfielder")
                        .length
                    }
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Midfielders</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {
                      team.squad.filter((p) => p.positionGroup === "Attacker")
                        .length
                    }
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Attackers</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Total squad:{" "}
                  <span className="font-medium text-foreground">
                    {team.squad.length} players
                  </span>
                  {team.coach && (
                    <>
                      {" "}
                      · Manager:{" "}
                      <span className="font-medium text-foreground">
                        {team.coach.displayName}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Results</CardTitle>
                <Link
                  href={`/teams/${slug}/matches`}
                  className="text-sm text-primary hover:underline"
                >
                  View All Matches
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <TeamFixtures
                fixtures={fixtures.recent}
                teamId={teamId}
                emptyMessage="No recent matches"
                variant="compact"
              />
            </CardContent>
          </Card>

          {/* About Section - SEO Content (visible on all tabs) */}
          <div className="mt-8">
            <TeamAbout
              team={team}
              nextMatch={nextMatch}
              lastMatch={lastMatch}
            />
          </div>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Last Starting XI - Pitch View */}
          {lastLineup && lastLineup.starters.length > 0 && (
            <Card className="overflow-hidden gap-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Last Starting XI</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TeamPitchView lineup={lastLineup} teamColor="blue" />
              </CardContent>
            </Card>
          )}

          {/* League Standings (Mini Tables for ALL leagues) */}
          {allStandingsTables.map((table) => {
            const tableTeamStanding = findTeamStanding(table.standings, teamId)
            if (!tableTeamStanding) return null

            return (
              <Card key={`${table.seasonId}-${table.groupName || "main"}`}>
                <CardHeader className="pb-0">
                  <Link
                    href={`/leagues/${slugify(table.leagueName || "league")}-${
                      table.leagueId
                    }`}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                  >
                    <Avatar className="h-6 w-6 rounded bg-white">
                      <AvatarImage
                        src={table.leagueLogo || undefined}
                        alt={table.leagueName || "League"}
                        className="object-contain p-0.5"
                      />
                      <AvatarFallback className="rounded text-[10px] bg-muted">
                        {(table.leagueName || "L").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-base truncate group-hover:text-primary transition-colors">
                      {table.groupName || table.leagueName || "League Table"}
                    </CardTitle>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="px-2 sm:px-3 py-2 text-left font-medium">#</th>
                          <th className="px-2 sm:px-3 py-2 text-left font-medium">
                            Team
                          </th>
                          <th className="px-2 sm:px-3 py-2 text-center font-medium">
                            P
                          </th>
                          <th className="px-2 sm:px-3 py-2 text-center font-medium">
                            Pts
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.standings
                          .filter((s) => {
                            // Show teams around the current team's position (±3)
                            const diff = Math.abs(
                              s.position - tableTeamStanding.position
                            )
                            return diff <= 3
                          })
                          .sort((a, b) => a.position - b.position)
                          .map((standing) => (
                            <tr
                              key={standing.teamId}
                              className={`border-b last:border-0 ${
                                standing.teamId === teamId
                                  ? "bg-primary/5 font-medium"
                                  : ""
                              }`}
                            >
                              <td className="px-2 sm:px-3 py-2">{standing.position}</td>
                              <td className="px-2 sm:px-3 py-2">
                                <Link
                                  href={getTeamUrl(
                                    standing.teamName,
                                    standing.teamId
                                  )}
                                  className="flex items-center gap-1.5 sm:gap-2 hover:text-primary transition-colors"
                                >
                                  <div className="relative h-3 w-3 sm:h-4 sm:w-4 shrink-0">
                                    <Image
                                      src={standing.teamLogo}
                                      alt={standing.teamName}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  <span className="truncate max-w-[70px] sm:max-w-[100px]">
                                    {standing.teamName}
                                  </span>
                                </Link>
                              </td>
                              <td className="px-2 sm:px-3 py-2 text-center">
                                {standing.played}
                              </td>
                              <td className="px-2 sm:px-3 py-2 text-center font-medium">
                                {standing.points}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Active Competitions */}
          {team.activeSeasons.length > 0 && (
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">Active Competitions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {team.activeSeasons.slice(0, 5).map((season) => (
                    <div key={season.id} className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 rounded bg-white">
                        <AvatarImage
                          src={season.league?.logo}
                          alt={season.league?.name || season.name}
                          className="object-contain p-0.5"
                        />
                        <AvatarFallback className="rounded text-[10px] bg-muted">
                          {(season.league?.name || season.name).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">
                        {season.league?.name || season.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
