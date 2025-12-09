"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { PlayerSeasonStats } from "@/types/football"

interface PlayerCurrentSeasonProps {
  stats: PlayerSeasonStats | null
}

export function PlayerCurrentSeason({ stats }: PlayerCurrentSeasonProps) {
  if (!stats) return null

  const statItems = [
    { value: stats.goals, label: "Goals" },
    { value: stats.assists, label: "Assists" },
    { value: stats.appearances, label: "Matches" },
    { value: stats.minutesPlayed, label: "Minutes" },
    {
      value: stats.rating?.toFixed(2) || "-",
      label: "Rating",
      highlight: true,
    },
    { value: stats.yellowCards, label: "Yellow", icon: "yellow" },
    { value: stats.redCards, label: "Red", icon: "red" },
  ]

  return (
    <Card className="overflow-hidden py-0">
      {/* Season Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        {stats.leagueLogo && (
          <Image
            src={stats.leagueLogo}
            alt={stats.leagueName || "League"}
            width={20}
            height={20}
            className="object-contain"
          />
        )}
        <span className="text-sm font-medium">
          {stats.leagueName || stats.seasonName}
        </span>
      </div>

      {/* Stats Grid */}
      <CardContent className="p-0">
        <div className="grid grid-cols-4 sm:grid-cols-7 divide-x divide-border">
          {statItems.map((item) => (
            <div key={item.label} className="p-3 text-center">
              <p
                className={`text-lg font-bold tabular-nums ${
                  item.highlight ? "text-green-500" : ""
                }`}
              >
                {item.icon === "yellow" ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-3.5 bg-yellow-400 rounded-sm" />
                    {item.value}
                  </span>
                ) : item.icon === "red" ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-3.5 bg-red-500 rounded-sm" />
                    {item.value}
                  </span>
                ) : (
                  item.value
                )}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
