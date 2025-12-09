"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FixtureDetail, StandingTable, MatchStatistic, FormFixtureData } from "@/types/football"
import { getFormFromFixtures } from "@/components/teams/form-strip"

// ================================
// Match Quick Stats Widget
// ================================
interface MatchQuickStatsProps {
  statistics: MatchStatistic[]
  homeTeam: FixtureDetail["homeTeam"]
  awayTeam: FixtureDetail["awayTeam"]
}

export function MatchQuickStats({ statistics, homeTeam, awayTeam }: MatchQuickStatsProps) {
  if (statistics.length === 0) return null

  // Get key stats
  const keyStats = ["Shots Total", "Shots On Target", "Possession %", "Corners", "Fouls"]
  const displayStats = statistics.filter(stat => keyStats.includes(stat.type))

  if (displayStats.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Team headers */}
        <div className="flex justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            {homeTeam.logo && (
              <Image
                src={homeTeam.logo}
                alt={homeTeam.name}
                width={16}
                height={16}
                className="object-contain"
              />
            )}
            <span className="truncate max-w-[60px]">{homeTeam.shortCode || homeTeam.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="truncate max-w-[60px]">{awayTeam.shortCode || awayTeam.name}</span>
            {awayTeam.logo && (
              <Image
                src={awayTeam.logo}
                alt={awayTeam.name}
                width={16}
                height={16}
                className="object-contain"
              />
            )}
          </div>
        </div>

        {displayStats.slice(0, 4).map((stat) => {
          const homeVal = typeof stat.home === "number" ? stat.home : 0
          const awayVal = typeof stat.away === "number" ? stat.away : 0
          const total = homeVal + awayVal || 1

          return (
            <div key={stat.type} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium tabular-nums">{homeVal}</span>
                <span className="text-muted-foreground">{stat.type}</span>
                <span className="font-medium tabular-nums">{awayVal}</span>
              </div>
              <div className="flex h-1.5 rounded-full overflow-hidden bg-muted">
                <div
                  className="bg-blue-500 transition-all"
                  style={{ width: `${(homeVal / total) * 100}%` }}
                />
                <div
                  className="bg-red-500 transition-all"
                  style={{ width: `${(awayVal / total) * 100}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ================================
// Team Form Comparison Widget
// ================================
interface TeamFormWidgetProps {
  homeTeam: FixtureDetail["homeTeam"]
  awayTeam: FixtureDetail["awayTeam"]
  homeForm: FormFixtureData[]
  awayForm: FormFixtureData[]
}

export function TeamFormWidget({ homeTeam, awayTeam, homeForm, awayForm }: TeamFormWidgetProps) {
  const homeResults = getFormFromFixtures(homeForm)
  const awayResults = getFormFromFixtures(awayForm)

  if (homeResults.length === 0 && awayResults.length === 0) return null

  const getFormStats = (results: string[]) => ({
    wins: results.filter(r => r === "W").length,
    draws: results.filter(r => r === "D").length,
    losses: results.filter(r => r === "L").length,
  })

  const homeStats = getFormStats(homeResults)
  const awayStats = getFormStats(awayResults)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Last 5 Matches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Home team form */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            {homeTeam.logo && (
              <Image
                src={homeTeam.logo}
                alt={homeTeam.name}
                width={18}
                height={18}
                className="object-contain"
              />
            )}
            <span className="text-xs font-medium truncate flex-1">{homeTeam.name}</span>
            <span className="text-xs text-muted-foreground">
              {homeStats.wins}W {homeStats.draws}D {homeStats.losses}L
            </span>
          </div>
          <div className="flex gap-1">
            {homeResults.map((result, i) => (
              <FormBadge key={i} result={result} />
            ))}
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Away team form */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            {awayTeam.logo && (
              <Image
                src={awayTeam.logo}
                alt={awayTeam.name}
                width={18}
                height={18}
                className="object-contain"
              />
            )}
            <span className="text-xs font-medium truncate flex-1">{awayTeam.name}</span>
            <span className="text-xs text-muted-foreground">
              {awayStats.wins}W {awayStats.draws}D {awayStats.losses}L
            </span>
          </div>
          <div className="flex gap-1">
            {awayResults.map((result, i) => (
              <FormBadge key={i} result={result} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FormBadge({ result }: { result: string }) {
  return (
    <div
      className={cn(
        "w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white",
        result === "W" && "bg-green-500",
        result === "D" && "bg-gray-400",
        result === "L" && "bg-red-500"
      )}
    >
      {result}
    </div>
  )
}

// ================================
// League Mini Table Widget
// ================================
interface LeagueMiniTableProps {
  standings: StandingTable[]
  homeTeamId: number
  awayTeamId: number
  leagueSlug?: string
}

export function LeagueMiniTable({
  standings,
  homeTeamId,
  awayTeamId,
  leagueSlug
}: LeagueMiniTableProps) {
  // Find the table containing our teams
  const table = standings.find(t =>
    t.standings.some(s => s.teamId === homeTeamId || s.teamId === awayTeamId)
  )

  if (!table || table.standings.length === 0) return null

  // Get positions around our teams
  const homePos = table.standings.findIndex(s => s.teamId === homeTeamId)
  const awayPos = table.standings.findIndex(s => s.teamId === awayTeamId)

  // Get a slice of the table around these teams
  const minPos = Math.max(0, Math.min(homePos, awayPos) - 1)
  const maxPos = Math.min(table.standings.length - 1, Math.max(homePos, awayPos) + 1)

  const displayStandings = table.standings.slice(minPos, maxPos + 1)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Standings</CardTitle>
          {leagueSlug && (
            <Link
              href={`/leagues/${leagueSlug}`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View Full →
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground border-b">
              <th className="text-left pl-4 py-1.5 font-medium">#</th>
              <th className="text-left py-1.5 font-medium">Team</th>
              <th className="text-center py-1.5 font-medium">P</th>
              <th className="text-center py-1.5 font-medium">GD</th>
              <th className="text-center pr-4 py-1.5 font-medium">Pts</th>
            </tr>
          </thead>
          <tbody>
            {displayStandings.map((standing) => {
              const isHome = standing.teamId === homeTeamId
              const isAway = standing.teamId === awayTeamId
              const isHighlighted = isHome || isAway
              return (
                <tr
                  key={standing.teamId}
                  className={cn(
                    "border-b last:border-0 transition-colors",
                    isHighlighted && "bg-primary/10 font-semibold"
                  )}
                >
                  <td className={cn(
                    "py-2 relative",
                    isHighlighted ? "pl-3" : "pl-4"
                  )}>
                    {isHighlighted && (
                      <div className={cn(
                        "absolute left-0 top-1 bottom-1 w-1 rounded-r",
                        isHome ? "bg-blue-500" : "bg-red-500"
                      )} />
                    )}
                    {standing.position}
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-1.5">
                      {standing.teamLogo && (
                        <Image
                          src={standing.teamLogo}
                          alt={standing.teamName}
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                      )}
                      <span className={cn(
                        "truncate max-w-[100px]",
                        isHighlighted && "text-foreground"
                      )}>
                        {standing.teamName}
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-2">{standing.played}</td>
                  <td className="text-center py-2">
                    {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                  </td>
                  <td className="text-center pr-4 py-2 font-semibold">{standing.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

// ================================
// Match Info Widget
// ================================
interface MatchInfoWidgetProps {
  fixture: FixtureDetail
}

export function MatchInfoWidget({ fixture }: MatchInfoWidgetProps) {
  const { venue, referee, league, startTime } = fixture

  const hasInfo = venue || referee || league

  if (!hasInfo) return null

  const startDate = new Date(startTime)
  const isUpcoming = startDate > new Date()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Match Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {venue && (
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground shrink-0">📍</span>
            <div>
              <p className="font-medium">{venue.name}</p>
              {venue.capacity && (
                <p className="text-muted-foreground">Capacity: {venue.capacity.toLocaleString()}</p>
              )}
            </div>
          </div>
        )}

        {referee && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">👨‍⚖️</span>
            <span>{referee.name}</span>
          </div>
        )}

        {league && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">🏆</span>
            <span>{league.name}</span>
          </div>
        )}

        {isUpcoming && (
          <div className="pt-2 border-t">
            <Badge variant="outline" className="text-xs">
              Upcoming Match
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
