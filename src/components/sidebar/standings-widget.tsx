"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn, getTeamUrl, getLeagueUrl } from "@/lib/utils"
import type { Standing } from "@/types/football"

interface LeagueStandings {
  leagueId: number
  leagueName: string
  leagueLogo: string
  standings: Standing[]
}

interface StandingsWidgetProps {
  leagueStandings: LeagueStandings[]
  className?: string
}

export function StandingsWidget({ leagueStandings, className }: StandingsWidgetProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (leagueStandings.length === 0) return null

  const activeLeague = leagueStandings[activeIndex]

  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-sm">Standings</h3>
      </div>

      {/* League Selector */}
      <div className="px-3 py-2 border-b border-border">
        <select
          value={activeIndex}
          onChange={(e) => setActiveIndex(Number(e.target.value))}
          className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
        >
          {leagueStandings.map((league, index) => (
            <option key={league.leagueId} value={index}>
              {league.leagueName}
            </option>
          ))}
        </select>
      </div>

      {/* League Header with Link */}
      <Link
        href={getLeagueUrl(activeLeague.leagueName, activeLeague.leagueId)}
        className="flex items-center gap-2 px-3 py-2 bg-muted/20 hover:bg-muted/40 transition-colors border-b border-border"
      >
        <Image
          src={activeLeague.leagueLogo}
          alt={activeLeague.leagueName}
          width={24}
          height={24}
          className="object-contain w-6 h-6"
        />
        <span className="text-sm font-semibold">{activeLeague.leagueName}</span>
      </Link>

      {/* Standings Table - No scroll, show all teams */}
      <div className="px-2">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground border-b border-border">
              <th className="text-left font-medium py-2 pl-2 w-7">#</th>
              <th className="text-left font-medium py-2">Team</th>
              <th className="text-center font-medium py-2 w-7">P</th>
              <th className="text-center font-medium py-2 w-7">W</th>
              <th className="text-center font-medium py-2 w-7">D</th>
              <th className="text-center font-medium py-2 w-7">L</th>
              <th className="text-center font-medium py-2 w-8">GD</th>
              <th className="text-center font-medium py-2 pr-2 w-8">Pts</th>
            </tr>
          </thead>
          <tbody>
            {activeLeague.standings.map((team, idx) => (
              <tr
                key={team.teamId}
                className={cn(
                  "hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0",
                  idx % 2 === 1 && "bg-muted/10"
                )}
              >
                <td className={cn(
                  "py-1.5 pl-2 font-medium text-[11px]",
                  team.position <= 4 && "text-green-500",
                  team.position >= activeLeague.standings.length - 2 && "text-red-500"
                )}>
                  {team.position}
                </td>
                <td className="py-1.5">
                  <Link
                    href={getTeamUrl(team.teamName, team.teamId)}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <Image
                      src={team.teamLogo}
                      alt={team.teamName}
                      width={14}
                      height={14}
                      className="object-contain flex-shrink-0 w-3.5 h-3.5"
                    />
                    <span className="font-medium truncate max-w-[70px] text-[11px]">
                      {team.teamName}
                    </span>
                  </Link>
                </td>
                <td className="py-1.5 text-center text-muted-foreground text-[11px]">{team.played}</td>
                <td className="py-1.5 text-center text-muted-foreground text-[11px]">{team.won}</td>
                <td className="py-1.5 text-center text-muted-foreground text-[11px]">{team.drawn}</td>
                <td className="py-1.5 text-center text-muted-foreground text-[11px]">{team.lost}</td>
                <td className={cn(
                  "py-1.5 text-center text-[11px]",
                  team.goalDifference > 0 ? "text-green-500" : team.goalDifference < 0 ? "text-red-500" : "text-muted-foreground"
                )}>
                  {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                </td>
                <td className="py-1.5 text-center font-bold pr-2 text-[11px]">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
