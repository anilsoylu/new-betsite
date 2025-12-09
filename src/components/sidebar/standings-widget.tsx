"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
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
      {/* League Tabs */}
      <div className="flex border-b border-border overflow-x-auto scrollbar-hide">
        {leagueStandings.map((league, index) => (
          <button
            key={league.leagueId}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors",
              "hover:bg-muted/50",
              activeIndex === index
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground"
            )}
          >
            <Image
              src={league.leagueLogo}
              alt={league.leagueName}
              width={16}
              height={16}
              className="object-contain"
            />
            <span className="hidden sm:inline">{league.leagueName}</span>
          </button>
        ))}
      </div>

      {/* Standings Table */}
      <div className="p-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground">
              <th className="text-left font-medium pb-2 w-6">#</th>
              <th className="text-left font-medium pb-2">Team</th>
              <th className="text-center font-medium pb-2 w-8">P</th>
              <th className="text-center font-medium pb-2 w-8">GD</th>
              <th className="text-center font-medium pb-2 w-8">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {activeLeague.standings.slice(0, 5).map((team) => (
              <tr key={team.teamId} className="hover:bg-muted/30">
                <td className="py-2 text-muted-foreground">{team.position}</td>
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
                <td className="py-2 text-center text-muted-foreground">{team.played}</td>
                <td className={cn(
                  "py-2 text-center",
                  team.goalDifference > 0 ? "text-green-500" : team.goalDifference < 0 ? "text-red-500" : "text-muted-foreground"
                )}>
                  {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                </td>
                <td className="py-2 text-center font-bold">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Full Table Link */}
      <Link
        href={getLeagueUrl(activeLeague.leagueName, activeLeague.leagueId)}
        className={cn(
          "flex items-center justify-between px-4 py-2.5 border-t border-border transition-colors",
          "hover:bg-muted/50 group text-xs"
        )}
      >
        <span className="font-medium">View Full Table</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  )
}
