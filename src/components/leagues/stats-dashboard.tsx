"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Trophy,
  Target,
  AlertTriangle,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react"
import { cn, getPlayerUrl } from "@/lib/utils"
import type { TopScorer, League } from "@/types/football"

interface StatsSummary {
  goals: TopScorer[]
  assists: TopScorer[]
  yellowCards: TopScorer[]
  cleanSheets: TopScorer[]
  ratings: TopScorer[]
}

interface StatsDashboardProps {
  league: League
  stats: StatsSummary
  className?: string
}

interface StatHighlightProps {
  icon: React.ElementType
  label: string
  player: TopScorer | null
  value: string | number
  color: string
  bgColor: string
}

function StatHighlight({
  icon: Icon,
  label,
  player,
  value,
  color,
  bgColor,
}: StatHighlightProps) {
  if (!player) return null

  return (
    <Link
      href={getPlayerUrl(player.playerName, player.playerId)}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border p-4",
        "hover:border-primary/50 transition-all group",
        bgColor
      )}
    >
      {/* Background Icon */}
      <Icon className="absolute -right-2 -bottom-2 h-20 w-20 opacity-5" />

      {/* Content */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Icon className={cn("h-4 w-4", color)} />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Player Image */}
          <div className="h-12 w-12 rounded-full overflow-hidden bg-background/50 shrink-0 ring-2 ring-background">
            {player.playerImage ? (
              <Image
                src={player.playerImage}
                alt={player.playerName}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                ?
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
              {player.playerName}
            </p>
            <div className="flex items-center gap-1.5">
              {player.teamLogo && (
                <Image
                  src={player.teamLogo}
                  alt={player.teamName}
                  width={14}
                  height={14}
                  className="object-contain"
                />
              )}
              <span className="text-xs text-muted-foreground truncate">
                {player.teamName}
              </span>
            </div>
          </div>

          {/* Value */}
          <div className={cn("text-2xl font-bold tabular-nums", color)}>
            {value}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function StatsDashboard({
  league,
  stats,
  className,
}: StatsDashboardProps) {
  const topScorer = stats.goals[0] || null
  const topAssister = stats.assists[0] || null
  const mostCards = stats.yellowCards[0] || null
  const topCleanSheet = stats.cleanSheets[0] || null
  const topRated = stats.ratings[0] || null

  // Format rating (API returns 782 for 7.82)
  const formatRating = (player: TopScorer | null) => {
    if (!player) return "-"
    return (player.goals / 100).toFixed(2)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-lg">Season Leaders</h2>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatHighlight
          icon={Trophy}
          label="Top Scorer"
          player={topScorer}
          value={topScorer?.goals ?? 0}
          color="text-emerald-600 dark:text-emerald-400"
          bgColor="bg-emerald-500/5"
        />

        <StatHighlight
          icon={Target}
          label="Top Assists"
          player={topAssister}
          value={topAssister?.assists ?? 0}
          color="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-500/5"
        />

        <StatHighlight
          icon={Shield}
          label="Clean Sheets"
          player={topCleanSheet}
          value={topCleanSheet?.goals ?? 0}
          color="text-cyan-600 dark:text-cyan-400"
          bgColor="bg-cyan-500/5"
        />

        <StatHighlight
          icon={Star}
          label="Top Rated"
          player={topRated}
          value={formatRating(topRated)}
          color="text-amber-600 dark:text-amber-400"
          bgColor="bg-amber-500/5"
        />

        <StatHighlight
          icon={AlertTriangle}
          label="Most Cards"
          player={mostCards}
          value={mostCards?.yellowCards ?? 0}
          color="text-yellow-600 dark:text-yellow-400"
          bgColor="bg-yellow-500/5"
        />
      </div>
    </div>
  )
}
