"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Star, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getFixtureUrl, cn } from "@/lib/utils"
import { useFavoritesStore } from "@/stores/favorites-store"
import type { Fixture } from "@/types/football"

interface FixtureCardProps {
  fixture: Fixture
  showFavorites?: boolean
  showLeague?: boolean
  variant?: "default" | "compact" | "featured"
}

export function FixtureCard({
  fixture,
  showFavorites = true,
  showLeague = true,
  variant = "default"
}: FixtureCardProps) {
  const { homeTeam, awayTeam, score, status, statusDetail, minute, isLive, startTime, id: fixtureId, league, venue } = fixture
  const { isFavorite, toggleFavorite } = useFavoritesStore()
  const [hasMounted, setHasMounted] = useState(false)
  const [animatingStars, setAnimatingStars] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Format time only on client to avoid hydration mismatch (server vs user timezone)
  const formattedTime = hasMounted ? format(new Date(startTime), "HH:mm") : "--:--"
  const formattedDate = hasMounted ? format(new Date(startTime), "dd MMM") : "-- ---"

  // Only check favorites after mount to avoid hydration mismatch
  const isHomeFavorite = hasMounted && isFavorite("teams", homeTeam.id)
  const isAwayFavorite = hasMounted && isFavorite("teams", awayTeam.id)
  const isMatchFavorite = hasMounted && isFavorite("matches", fixtureId)
  const hasFavoriteTeam = isHomeFavorite || isAwayFavorite

  const triggerStarAnimation = (key: string) => {
    setAnimatingStars(prev => ({ ...prev, [key]: true }))
    setTimeout(() => {
      setAnimatingStars(prev => ({ ...prev, [key]: false }))
    }, 400)
  }

  const handleTeamFavoriteClick = (e: React.MouseEvent, teamId: number, key: string) => {
    e.preventDefault()
    e.stopPropagation()
    triggerStarAnimation(key)
    toggleFavorite("teams", teamId)
  }

  const handleMatchFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    triggerStarAnimation("match")
    toggleFavorite("matches", fixtureId)
  }

  // Star button component for reuse
  const StarButton = ({
    isFavorited,
    onClick,
    animKey,
    size = "sm"
  }: {
    isFavorited: boolean
    onClick: (e: React.MouseEvent) => void
    animKey: string
    size?: "sm" | "md"
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-full transition-all active:scale-90",
        size === "sm" ? "h-7 w-7" : "h-8 w-8",
        isFavorited
          ? "text-yellow-500"
          : "text-muted-foreground/50 hover:text-muted-foreground"
      )}
    >
      <Star
        className={cn(
          "transition-transform",
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          isFavorited && "fill-yellow-500",
          animatingStars[animKey] && "animate-star-pop"
        )}
      />
    </button>
  )

  return (
    <Link href={getFixtureUrl(fixture)}>
      <Card
        className={cn(
          "overflow-hidden transition-all cursor-pointer hover-lift",
          isLive && "ring-2 ring-red-500/30 bg-red-500/5",
          !isLive && (hasFavoriteTeam || isMatchFavorite) && "ring-1 ring-yellow-500/30 bg-yellow-500/5"
        )}
      >
        {/* League Header */}
        {showLeague && league && (
          <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
            <div className="flex items-center gap-2 min-w-0">
              {league.logo && (
                <Image
                  src={league.logo}
                  alt={league.name}
                  width={16}
                  height={16}
                  className="object-contain shrink-0"
                />
              )}
              <span className="text-xs font-medium text-muted-foreground truncate">
                {league.name}
              </span>
            </div>
            {/* Match favorite button */}
            {showFavorites && (
              <StarButton
                isFavorited={isMatchFavorite}
                onClick={handleMatchFavoriteClick}
                animKey="match"
                size="sm"
              />
            )}
          </div>
        )}

        <CardContent className={cn("p-3", variant === "featured" && "p-4")}>
          {/* Teams and Scores */}
          <div className="space-y-2">
            {/* Home Team */}
            <div className="flex items-center gap-2">
              {/* Team Logo */}
              <div className="shrink-0">
                {homeTeam.logo ? (
                  <Image
                    src={homeTeam.logo}
                    alt={homeTeam.name}
                    width={variant === "featured" ? 32 : 24}
                    height={variant === "featured" ? 32 : 24}
                    className="object-contain"
                  />
                ) : (
                  <div className={cn(
                    "rounded bg-muted flex items-center justify-center font-semibold text-muted-foreground",
                    variant === "featured" ? "w-8 h-8 text-sm" : "w-6 h-6 text-xs"
                  )}>
                    {homeTeam.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Team Name */}
              <span className={cn(
                "flex-1 truncate",
                homeTeam.isWinner ? "font-semibold" : "text-muted-foreground",
                variant === "featured" ? "text-base" : "text-sm"
              )}>
                {homeTeam.name}
              </span>

              {/* Team Favorite Star */}
              {showFavorites && (
                <StarButton
                  isFavorited={isHomeFavorite}
                  onClick={(e) => handleTeamFavoriteClick(e, homeTeam.id, "home")}
                  animKey="home"
                  size="sm"
                />
              )}

              {/* Score */}
              {score && (
                <span className={cn(
                  "font-bold tabular-nums w-6 text-center",
                  homeTeam.isWinner ? "text-foreground" : "text-muted-foreground",
                  variant === "featured" ? "text-xl" : "text-base"
                )}>
                  {score.home}
                </span>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-2">
              {/* Team Logo */}
              <div className="shrink-0">
                {awayTeam.logo ? (
                  <Image
                    src={awayTeam.logo}
                    alt={awayTeam.name}
                    width={variant === "featured" ? 32 : 24}
                    height={variant === "featured" ? 32 : 24}
                    className="object-contain"
                  />
                ) : (
                  <div className={cn(
                    "rounded bg-muted flex items-center justify-center font-semibold text-muted-foreground",
                    variant === "featured" ? "w-8 h-8 text-sm" : "w-6 h-6 text-xs"
                  )}>
                    {awayTeam.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Team Name */}
              <span className={cn(
                "flex-1 truncate",
                awayTeam.isWinner ? "font-semibold" : "text-muted-foreground",
                variant === "featured" ? "text-base" : "text-sm"
              )}>
                {awayTeam.name}
              </span>

              {/* Team Favorite Star */}
              {showFavorites && (
                <StarButton
                  isFavorited={isAwayFavorite}
                  onClick={(e) => handleTeamFavoriteClick(e, awayTeam.id, "away")}
                  animKey="away"
                  size="sm"
                />
              )}

              {/* Score */}
              {score && (
                <span className={cn(
                  "font-bold tabular-nums w-6 text-center",
                  awayTeam.isWinner ? "text-foreground" : "text-muted-foreground",
                  variant === "featured" ? "text-xl" : "text-base"
                )}>
                  {score.away}
                </span>
              )}
            </div>
          </div>

          {/* Match Info Footer */}
          <div className="flex items-center gap-2 mt-3 pt-2 border-t">
            {/* Status Badge */}
            {isLive ? (
              <Badge variant="destructive" className="animate-pulse text-xs h-5 px-1.5 gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                </span>
                {minute ? `${minute}'` : "LIVE"}
              </Badge>
            ) : status === "finished" ? (
              <Badge variant="secondary" className="text-xs h-5 px-1.5">FT</Badge>
            ) : status === "scheduled" ? (
              <span className="text-xs font-medium text-muted-foreground">
                {formattedTime}
              </span>
            ) : (
              <Badge variant="outline" className="text-xs h-5 px-1.5">{statusDetail}</Badge>
            )}

            {/* Venue */}
            {venue?.name && (
              <>
                <span className="text-muted-foreground/30">•</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{venue.name}</span>
                </div>
              </>
            )}

            {/* No league header case - show match favorite */}
            {!showLeague && showFavorites && (
              <div className="ml-auto">
                <StarButton
                  isFavorited={isMatchFavorite}
                  onClick={handleMatchFavoriteClick}
                  animKey="match"
                  size="sm"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
