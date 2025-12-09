import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getFixtureUrl } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { Fixture } from "@/types/football"

interface TeamFixturesProps {
  title: string
  fixtures: Array<Fixture>
  teamId: number
  emptyMessage?: string
}

export function TeamFixtures({
  title,
  fixtures,
  teamId,
  emptyMessage = "No matches",
}: TeamFixturesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {fixtures.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {fixtures.map((fixture) => (
              <FixtureRow key={fixture.id} fixture={fixture} teamId={teamId} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface FixtureRowProps {
  fixture: Fixture
  teamId: number
}

function FixtureRow({ fixture, teamId }: FixtureRowProps) {
  const isHome = fixture.homeTeam.id === teamId
  const opponent = isHome ? fixture.awayTeam : fixture.homeTeam
  const isFinished = fixture.status === "finished"
  const isLive = fixture.isLive

  // Determine result for this team
  let result: "W" | "D" | "L" | null = null
  if (isFinished && fixture.score) {
    const teamScore = isHome ? fixture.score.home : fixture.score.away
    const opponentScore = isHome ? fixture.score.away : fixture.score.home

    if (teamScore > opponentScore) result = "W"
    else if (teamScore < opponentScore) result = "L"
    else result = "D"
  }

  const scoreDisplay = fixture.score
    ? isHome
      ? `${fixture.score.home} - ${fixture.score.away}`
      : `${fixture.score.away} - ${fixture.score.home}`
    : null

  return (
    <Link
      href={getFixtureUrl(fixture)}
      className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
    >
      {/* Result Badge */}
      {isFinished && result && (
        <Badge
          variant="outline"
          className={cn(
            "w-6 h-6 p-0 flex items-center justify-center text-xs font-bold shrink-0",
            result === "W" && "bg-green-500/10 text-green-600 border-green-500/30",
            result === "D" && "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
            result === "L" && "bg-red-500/10 text-red-600 border-red-500/30"
          )}
        >
          {result}
        </Badge>
      )}

      {/* Live Badge */}
      {isLive && (
        <Badge variant="destructive" className="w-6 h-6 p-0 flex items-center justify-center text-[10px] shrink-0">
          LIVE
        </Badge>
      )}

      {/* Date Badge (for upcoming) */}
      {!isFinished && !isLive && (
        <div className="w-6 h-6 flex items-center justify-center text-[10px] text-muted-foreground shrink-0">
          {format(new Date(fixture.startTime), "dd")}
        </div>
      )}

      {/* Opponent */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="relative h-6 w-6 shrink-0">
          {opponent.logo ? (
            <Image
              src={opponent.logo}
              alt={opponent.name}
              fill
              className="object-contain"
            />
          ) : (
            <div className="h-full w-full bg-muted rounded-full" />
          )}
        </div>
        <span className="text-sm truncate">{opponent.name}</span>
        <span className="text-xs text-muted-foreground shrink-0">
          ({isHome ? "H" : "A"})
        </span>
      </div>

      {/* Score or Time */}
      <div className="text-sm font-medium shrink-0">
        {scoreDisplay || format(new Date(fixture.startTime), "HH:mm")}
      </div>
    </Link>
  )
}
