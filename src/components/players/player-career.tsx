import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTeamUrl } from "@/lib/utils"
import type { PlayerTeam } from "@/types/football"

interface PlayerCareerProps {
  teams: Array<PlayerTeam>
}

export function PlayerCareer({ teams }: PlayerCareerProps) {
  if (teams.length === 0) {
    return null
  }

  // Sort teams: current first, then by start date (newest first)
  const sortedTeams = [...teams].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1
    if (!a.isCurrent && b.isCurrent) return 1
    if (!a.startDate || !b.startDate) return 0
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTeams.map((team) => (
            <Link
              key={team.id}
              href={getTeamUrl(team.teamName, team.teamId)}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {/* Team Logo */}
              <div className="relative h-10 w-10 shrink-0">
                {team.teamLogo ? (
                  <Image
                    src={team.teamLogo}
                    alt={team.teamName}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="h-full w-full bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm">
                    {team.teamName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Team Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{team.teamName}</span>
                  {team.isCurrent && (
                    <Badge variant="default" className="shrink-0">Current</Badge>
                  )}
                  {team.isCaptain && (
                    <Badge variant="secondary" className="shrink-0">Captain</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {team.startDate && (
                    <span>
                      {format(new Date(team.startDate), "MMM yyyy")}
                      {team.endDate ? ` - ${format(new Date(team.endDate), "MMM yyyy")}` : " - Present"}
                    </span>
                  )}
                  {team.jerseyNumber && (
                    <span className="ml-2">#{team.jerseyNumber}</span>
                  )}
                </div>
              </div>

              {/* Team Type */}
              <Badge variant="outline" className="shrink-0 capitalize">
                {team.teamType}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
