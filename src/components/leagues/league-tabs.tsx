"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export type LeagueTab = "overview" | "standings" | "fixtures" | "stats"

interface LeagueTabsProps {
  activeTab: LeagueTab
  onTabChange: (tab: LeagueTab) => void
  hasStandings?: boolean
}

const tabs: Array<{ id: LeagueTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "standings", label: "Standings" },
  { id: "fixtures", label: "Fixtures" },
  { id: "stats", label: "Stats" },
]

export function LeagueTabs({ activeTab, onTabChange, hasStandings = true }: LeagueTabsProps) {
  return (
    <div className="border-b border-border">
      <nav className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
        {tabs.map((tab) => {
          // Hide standings tab if no standings available (e.g., cup competitions)
          if (tab.id === "standings" && !hasStandings) return null

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative",
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
