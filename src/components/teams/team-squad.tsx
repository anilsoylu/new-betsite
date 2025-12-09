"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { SquadPlayer } from "@/types/football"

interface TeamSquadProps {
  squad: Array<SquadPlayer>
}

type PositionGroup = "Goalkeeper" | "Defender" | "Midfielder" | "Attacker" | "Unknown"

const POSITION_ORDER: PositionGroup[] = ["Goalkeeper", "Defender", "Midfielder", "Attacker", "Unknown"]

function getPositionGroup(position: string | null, positionGroup: string | null): PositionGroup {
  if (positionGroup) {
    const group = positionGroup.toLowerCase()
    if (group.includes("goalkeeper")) return "Goalkeeper"
    if (group.includes("defend")) return "Defender"
    if (group.includes("midfield")) return "Midfielder"
    if (group.includes("attack") || group.includes("forward")) return "Attacker"
  }

  if (position) {
    const pos = position.toLowerCase()
    if (pos.includes("goalkeeper") || pos === "gk") return "Goalkeeper"
    if (pos.includes("back") || pos.includes("defender") || pos === "cb" || pos === "rb" || pos === "lb") return "Defender"
    if (pos.includes("midfield") || pos === "cm" || pos === "dm" || pos === "am") return "Midfielder"
    if (pos.includes("forward") || pos.includes("striker") || pos.includes("wing") || pos === "st" || pos === "cf" || pos === "lw" || pos === "rw") return "Attacker"
  }

  return "Unknown"
}

function groupSquadByPosition(squad: Array<SquadPlayer>): Record<PositionGroup, Array<SquadPlayer>> {
  const grouped: Record<PositionGroup, Array<SquadPlayer>> = {
    Goalkeeper: [],
    Defender: [],
    Midfielder: [],
    Attacker: [],
    Unknown: [],
  }

  for (const player of squad) {
    const group = getPositionGroup(player.position, player.positionGroup)
    grouped[group].push(player)
  }

  // Sort by jersey number within each group
  for (const group of POSITION_ORDER) {
    grouped[group].sort((a, b) => (a.jerseyNumber || 99) - (b.jerseyNumber || 99))
  }

  return grouped
}

export function TeamSquad({ squad }: TeamSquadProps) {
  const [viewMode, setViewMode] = useState<"position" | "all">("position")
  const groupedSquad = groupSquadByPosition(squad)

  if (squad.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Squad</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No squad information available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Squad ({squad.length})</CardTitle>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "position" | "all")}>
          <TabsList className="h-8">
            <TabsTrigger value="position" className="text-xs px-3">By Position</TabsTrigger>
            <TabsTrigger value="all" className="text-xs px-3">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {viewMode === "position" ? (
          <div className="space-y-6">
            {POSITION_ORDER.map((group) => {
              const players = groupedSquad[group]
              if (players.length === 0) return null

              return (
                <div key={group}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    {group}s ({players.length})
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {players.map((player) => (
                      <PlayerCard key={player.id} player={player} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {squad
              .sort((a, b) => (a.jerseyNumber || 99) - (b.jerseyNumber || 99))
              .map((player) => (
                <PlayerCard key={player.id} player={player} showPosition />
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface PlayerCardProps {
  player: SquadPlayer
  showPosition?: boolean
}

function PlayerCard({ player, showPosition = false }: PlayerCardProps) {
  const initials = player.displayName
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <Avatar className="h-10 w-10">
        <AvatarImage src={player.image || undefined} alt={player.displayName} />
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {player.jerseyNumber && (
            <span className="text-xs font-mono text-muted-foreground w-5">
              {player.jerseyNumber}
            </span>
          )}
          <span className="font-medium truncate">{player.displayName}</span>
          {player.isCaptain && (
            <Badge variant="outline" className="text-[10px] px-1 py-0">C</Badge>
          )}
        </div>
        {showPosition && player.position && (
          <p className="text-xs text-muted-foreground truncate">{player.position}</p>
        )}
      </div>
    </div>
  )
}
