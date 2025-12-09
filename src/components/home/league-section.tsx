"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { MatchRow } from "./match-row"
import { AdSpace } from "@/components/sidebar"
import type { Fixture } from "@/types/football"

// Configuration for inline ads between matches
const MATCH_AD_CONFIG = {
  enabled: true,
  count: 2, // Number of ads to show between matches
  startAfter: 3, // Show first ad after this many matches
  interval: 5, // Show subsequent ads every N matches
}

interface LeagueSectionProps {
  leagueId: number
  leagueName: string
  leagueLogo?: string
  countryName?: string
  countryFlag?: string
  fixtures: Fixture[]
  defaultExpanded?: boolean
}

export function LeagueSection({
  leagueId,
  leagueName,
  leagueLogo,
  countryName,
  countryFlag,
  fixtures,
  defaultExpanded = true
}: LeagueSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const liveCount = fixtures.filter(f => f.isLive).length

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-card">
      {/* League Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2.5 transition-colors",
          "hover:bg-muted/30",
          isExpanded && "border-b border-border/50"
        )}
      >
        {/* League/Country Logo */}
        <div className="flex items-center gap-2 shrink-0">
          {countryFlag && (
            <Image
              src={countryFlag}
              alt={countryName || ""}
              width={20}
              height={14}
              className="object-contain rounded-sm"
            />
          )}
          {leagueLogo && !countryFlag && (
            <Image
              src={leagueLogo}
              alt={leagueName}
              width={20}
              height={20}
              className="object-contain"
            />
          )}
        </div>

        {/* League Info */}
        <div className="flex flex-col items-start flex-1 min-w-0">
          {countryName && (
            <span className="text-[10px] uppercase text-muted-foreground font-medium">
              {countryName}
            </span>
          )}
          <span className="text-sm font-semibold text-foreground truncate w-full text-left">
            {leagueName}
          </span>
        </div>

        {/* Match Count & Live Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          {liveCount > 0 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
              </span>
              <span className="text-[10px] font-bold text-red-500">{liveCount}</span>
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {fixtures.length} {fixtures.length === 1 ? "match" : "matches"}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Matches with Inline Ads */}
      {isExpanded && (
        <div className="divide-y divide-border/30">
          {fixtures.map((fixture, index) => {
            // Calculate ad positions
            const adPositions: number[] = []
            if (MATCH_AD_CONFIG.enabled) {
              for (let i = 0; i < MATCH_AD_CONFIG.count; i++) {
                adPositions.push(MATCH_AD_CONFIG.startAfter + i * MATCH_AD_CONFIG.interval)
              }
            }

            // Check if we should show an ad after this match
            const showAdAfter = adPositions.includes(index + 1) && index < fixtures.length - 1

            return (
              <div key={fixture.id}>
                <MatchRow fixture={fixture} />
                {showAdAfter && (
                  <div className="border-t border-border/30">
                    <AdSpace size="inline-banner" className="rounded-none border-0 bg-muted/20" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
