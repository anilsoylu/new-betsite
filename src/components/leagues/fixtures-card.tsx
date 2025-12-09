"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ChevronRight } from "lucide-react"
import { cn, getFixtureUrl } from "@/lib/utils"
import { useLiveFixture } from "@/hooks"
import type { Fixture } from "@/types/football"

// Separate component for live fixture display to use the polling hook
function LiveFixtureRow({ fixture }: { fixture: Fixture }) {
  const liveData = useLiveFixture({ fixture, pollInterval: 30000 })
  const { displayMinute, homeScore, awayScore, status } = liveData

  return (
    <Link
      href={getFixtureUrl(fixture)}
      className="flex items-center px-4 py-3 hover:bg-muted/30 transition-colors group"
    >
      {/* Date/Time Column */}
      <div className="w-16 shrink-0 text-center mr-3">
        {status === "halftime" ? (
          <div className="flex items-center justify-center gap-1 text-orange-500">
            <Clock className="h-3 w-3" />
            <span className="text-xs font-bold">HT</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1 text-red-500">
            <Clock className="h-3 w-3" />
            <span className="text-xs font-bold">{displayMinute || "LIVE"}</span>
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="flex-1 min-w-0">
        {/* Home Team */}
        <div className="flex items-center gap-2 mb-1">
          <Image
            src={fixture.homeTeam.logo}
            alt={fixture.homeTeam.name}
            width={18}
            height={18}
            className="object-contain shrink-0 w-[18px] h-auto"
          />
          <span
            className={cn(
              "text-sm truncate",
              fixture.homeTeam.isWinner && "font-semibold"
            )}
          >
            {fixture.homeTeam.name}
          </span>
        </div>
        {/* Away Team */}
        <div className="flex items-center gap-2">
          <Image
            src={fixture.awayTeam.logo}
            alt={fixture.awayTeam.name}
            width={18}
            height={18}
            className="object-contain shrink-0 w-[18px] h-auto"
          />
          <span
            className={cn(
              "text-sm truncate",
              fixture.awayTeam.isWinner && "font-semibold"
            )}
          >
            {fixture.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Score */}
      <div className="shrink-0 ml-3">
        <div className="text-center">
          <div className="text-sm font-bold text-red-500">
            {homeScore}
          </div>
          <div className="text-sm font-bold text-red-500">
            {awayScore}
          </div>
        </div>
      </div>

      {/* Chevron */}
      <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  )
}

interface FixturesCardProps {
  title: string
  fixtures: Fixture[]
  type: "upcoming" | "recent" | "live"
  showDate?: boolean
  className?: string
  onViewAll?: () => void
}

export function FixturesCard({ title, fixtures, type, showDate = true, className, onViewAll }: FixturesCardProps) {
  if (fixtures.length === 0) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          {type === "live" ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
          ) : (
            <Calendar className="h-4 w-4 text-primary" />
          )}
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground">({fixtures.length})</span>
        </div>
      </div>

      {/* Fixtures List */}
      <div className="divide-y divide-border/50">
        {fixtures.slice(0, 5).map((fixture) => (
          type === "live" ? (
            <LiveFixtureRow key={fixture.id} fixture={fixture} />
          ) : (
            <Link
              key={fixture.id}
              href={getFixtureUrl(fixture)}
              className="flex items-center px-4 py-3 hover:bg-muted/30 transition-colors group"
            >
              {/* Date/Time Column */}
              {showDate && (
                <div className="w-16 shrink-0 text-center mr-3">
                  {type === "upcoming" ? (
                    <>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {formatDate(fixture.startTime)}
                      </p>
                      <p className="text-xs font-medium">{formatTime(fixture.startTime)}</p>
                    </>
                  ) : (
                    <p className="text-[10px] text-muted-foreground">
                      {formatDate(fixture.startTime)}
                    </p>
                  )}
                </div>
              )}

              {/* Teams */}
              <div className="flex-1 min-w-0">
                {/* Home Team */}
                <div className="flex items-center gap-2 mb-1">
                  <Image
                    src={fixture.homeTeam.logo}
                    alt={fixture.homeTeam.name}
                    width={18}
                    height={18}
                    className="object-contain shrink-0 w-[18px] h-auto"
                  />
                  <span
                    className={cn(
                      "text-sm truncate",
                      fixture.homeTeam.isWinner && "font-semibold"
                    )}
                  >
                    {fixture.homeTeam.name}
                  </span>
                </div>
                {/* Away Team */}
                <div className="flex items-center gap-2">
                  <Image
                    src={fixture.awayTeam.logo}
                    alt={fixture.awayTeam.name}
                    width={18}
                    height={18}
                    className="object-contain shrink-0 w-[18px] h-auto"
                  />
                  <span
                    className={cn(
                      "text-sm truncate",
                      fixture.awayTeam.isWinner && "font-semibold"
                    )}
                  >
                    {fixture.awayTeam.name}
                  </span>
                </div>
              </div>

              {/* Score */}
              <div className="shrink-0 ml-3">
                {fixture.score && type === "recent" ? (
                  <div className="text-center">
                    <div className="text-sm font-bold">
                      {fixture.score.home}
                    </div>
                    <div className="text-sm font-bold">
                      {fixture.score.away}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-muted-foreground">
                    <span className="text-xs">vs</span>
                  </div>
                )}
              </div>

              {/* Chevron */}
              <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          )
        ))}
      </div>

      {/* View All Link */}
      {fixtures.length > 5 && onViewAll && (
        <div className="px-4 py-2 border-t border-border bg-muted/20">
          <button
            onClick={onViewAll}
            className="text-xs text-primary hover:text-primary/80 font-medium"
          >
            View all {fixtures.length} matches →
          </button>
        </div>
      )}
    </div>
  )
}
