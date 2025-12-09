import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Trophy, Calendar, Table2 } from "lucide-react"
import { SITE } from "@/lib/constants"
import {
  getLeagueById,
  getStandingsBySeason,
  getFixturesByDate,
  getTodayDate,
} from "@/lib/api/football-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, getTeamUrl, extractLeagueId, getFixtureUrl } from "@/lib/utils"
import { TOP_LEAGUES } from "@/components/sidebar/top-leagues"

interface LeaguePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: LeaguePageProps): Promise<Metadata> {
  const { slug } = await params
  const leagueId = extractLeagueId(slug)

  if (!leagueId) {
    return { title: `League | ${SITE.name}` }
  }

  // Try to get from TOP_LEAGUES first
  const knownLeague = TOP_LEAGUES.find((l) => l.id === leagueId)

  if (knownLeague) {
    return {
      title: `${knownLeague.name} | ${SITE.name}`,
      description: `${knownLeague.name} standings, fixtures, and statistics. ${knownLeague.country}.`,
    }
  }

  try {
    const league = await getLeagueById(leagueId)
    return {
      title: `${league.name} | ${SITE.name}`,
      description: `${league.name} standings, fixtures, and statistics.`,
    }
  } catch {
    return { title: `League | ${SITE.name}` }
  }
}

export default async function LeaguePage({ params }: LeaguePageProps) {
  const { slug } = await params
  const leagueId = extractLeagueId(slug)

  if (!leagueId) {
    notFound()
  }

  let league
  try {
    league = await getLeagueById(leagueId)
  } catch {
    notFound()
  }

  // Fetch standings and today's fixtures for this league
  const [standingsData, todayFixtures] = await Promise.all([
    league.currentSeasonId
      ? getStandingsBySeason(league.currentSeasonId).catch(() => [])
      : Promise.resolve([]),
    getFixturesByDate(getTodayDate()).catch(() => []),
  ])

  // Filter fixtures for this league
  const leagueFixtures = todayFixtures.filter((f) => f.leagueId === leagueId)

  // Get standings (first table - main league standings)
  const standings = standingsData.length > 0 ? standingsData[0].standings : []

  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Back Link */}
        <Link
          href="/leagues"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leagues
        </Link>

        {/* League Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-xl dark:bg-white bg-muted/50 flex items-center justify-center p-2">
            <Image
              src={league.logo}
              alt={league.name}
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{league.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {league.country && (
                <Badge variant="outline" className="text-xs">
                  {league.country.name}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {league.type}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Today's Fixtures */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today&apos;s Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leagueFixtures.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No matches scheduled for today
                  </p>
                ) : (
                  <div className="space-y-2">
                    {leagueFixtures.map((fixture) => (
                      <Link
                        key={fixture.id}
                        href={getFixtureUrl(fixture)}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Image
                            src={fixture.homeTeam.logo}
                            alt={fixture.homeTeam.name}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                          <span className="text-sm font-medium truncate">
                            {fixture.homeTeam.shortCode ||
                              fixture.homeTeam.name}
                          </span>
                        </div>
                        <div className="px-3 text-center">
                          {fixture.isLive || fixture.status === "finished" ? (
                            <span className="font-bold text-sm">
                              {fixture.score?.home ?? 0} -{" "}
                              {fixture.score?.away ?? 0}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {new Date(fixture.startTime).toLocaleTimeString(
                                "en-GB",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                          <span className="text-sm font-medium truncate">
                            {fixture.awayTeam.shortCode ||
                              fixture.awayTeam.name}
                          </span>
                          <Image
                            src={fixture.awayTeam.logo}
                            alt={fixture.awayTeam.name}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Standings */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Table2 className="h-5 w-5 text-primary" />
                  Standings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {standings.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No standings available
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-muted-foreground border-b">
                          <th className="text-left font-medium pb-2 w-6">#</th>
                          <th className="text-left font-medium pb-2">Team</th>
                          <th className="text-center font-medium pb-2 w-8">
                            P
                          </th>
                          <th className="text-center font-medium pb-2 w-8">
                            W
                          </th>
                          <th className="text-center font-medium pb-2 w-8">
                            D
                          </th>
                          <th className="text-center font-medium pb-2 w-8">
                            L
                          </th>
                          <th className="text-center font-medium pb-2 w-10">
                            GD
                          </th>
                          <th className="text-center font-medium pb-2 w-10">
                            Pts
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {standings.map((team) => (
                          <tr key={team.teamId} className="hover:bg-muted/30">
                            <td
                              className={cn(
                                "py-2",
                                team.position <= 4 &&
                                  "text-green-500 font-medium",
                                team.position >= standings.length - 2 &&
                                  "text-red-500 font-medium"
                              )}
                            >
                              {team.position}
                            </td>
                            <td className="py-2">
                              <Link
                                href={getTeamUrl(team.teamName, team.teamId)}
                                className="flex items-center gap-2 hover:text-primary transition-colors"
                              >
                                <Image
                                  src={team.teamLogo}
                                  alt={team.teamName}
                                  width={16}
                                  height={16}
                                  className="object-contain"
                                />
                                <span className="font-medium truncate max-w-[100px]">
                                  {team.teamName}
                                </span>
                              </Link>
                            </td>
                            <td className="py-2 text-center text-muted-foreground">
                              {team.played}
                            </td>
                            <td className="py-2 text-center text-muted-foreground">
                              {team.won}
                            </td>
                            <td className="py-2 text-center text-muted-foreground">
                              {team.drawn}
                            </td>
                            <td className="py-2 text-center text-muted-foreground">
                              {team.lost}
                            </td>
                            <td
                              className={cn(
                                "py-2 text-center",
                                team.goalDifference > 0
                                  ? "text-green-500"
                                  : team.goalDifference < 0
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                              )}
                            >
                              {team.goalDifference > 0
                                ? `+${team.goalDifference}`
                                : team.goalDifference}
                            </td>
                            <td className="py-2 text-center font-bold">
                              {team.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
