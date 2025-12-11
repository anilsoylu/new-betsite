"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type TeamTab =
  | "overview"
  | "matches"
  | "squad"
  | "stats"
  | "transfers"
  | "history"

const VALID_TABS: TeamTab[] = [
  "overview",
  "matches",
  "squad",
  "stats",
  "transfers",
  "history",
]

const TAB_LABELS: Record<TeamTab, string> = {
  overview: "Overview",
  matches: "Matches",
  squad: "Squad",
  stats: "Statistics",
  transfers: "Transfers",
  history: "History",
}

interface TeamTabsProps {
  defaultTab?: TeamTab
  overviewContent: React.ReactNode
  matchesContent: React.ReactNode
  squadContent: React.ReactNode
  statsContent: React.ReactNode
  transfersContent: React.ReactNode
  historyContent: React.ReactNode
  hasStats?: boolean
  hasTransfers?: boolean
  hasHistory?: boolean
}

export function TeamTabs({
  defaultTab = "overview",
  overviewContent,
  matchesContent,
  squadContent,
  statsContent,
  transfersContent,
  historyContent,
  hasStats = true,
  hasTransfers = true,
  hasHistory = true,
}: TeamTabsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get initial tab from URL or use default
  const getInitialTab = (): TeamTab => {
    const tabParam = searchParams.get("tab")
    if (tabParam && VALID_TABS.includes(tabParam as TeamTab)) {
      return tabParam as TeamTab
    }
    return defaultTab
  }

  const [activeTab, setActiveTab] = useState<TeamTab>(getInitialTab)

  // Sync with URL on mount and when searchParams change
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam && VALID_TABS.includes(tabParam as TeamTab)) {
      setActiveTab(tabParam as TeamTab)
    } else if (!tabParam) {
      setActiveTab("overview")
    }
  }, [searchParams])

  // Update URL without triggering navigation (pure client-side)
  const handleTabChange = useCallback(
    (value: string) => {
      const newTab = value as TeamTab
      setActiveTab(newTab)

      // Build new URL
      const params = new URLSearchParams(searchParams.toString())
      if (newTab === "overview") {
        params.delete("tab")
      } else {
        params.set("tab", newTab)
      }

      const queryString = params.toString()
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname

      // Update URL without navigation (no page reload, no router)
      window.history.replaceState(null, "", newUrl)
    },
    [pathname, searchParams]
  )

  // Filter visible tabs
  const visibleTabs = VALID_TABS.filter((tab) => {
    if (tab === "stats" && !hasStats) return false
    if (tab === "transfers" && !hasTransfers) return false
    if (tab === "history" && !hasHistory) return false
    return true
  })

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 overflow-x-auto scrollbar-hide">
        <TabsList className="h-auto p-0 bg-transparent rounded-none flex gap-1">
          {visibleTabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={cn(
                "flex-shrink-0 px-4 py-3 text-sm font-medium rounded-none border-b-2 transition-colors whitespace-nowrap data-[state=inactive]:border-transparent",
                "data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none",
                "data-[state=inactive]:text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {TAB_LABELS[tab]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="mt-6">
        <TabsContent value="overview" className="mt-0">
          {overviewContent}
        </TabsContent>
        <TabsContent value="matches" className="mt-0">
          {matchesContent}
        </TabsContent>
        <TabsContent value="squad" className="mt-0">
          {squadContent}
        </TabsContent>
        <TabsContent value="stats" className="mt-0">
          {statsContent}
        </TabsContent>
        <TabsContent value="transfers" className="mt-0">
          {transfersContent}
        </TabsContent>
        <TabsContent value="history" className="mt-0">
          {historyContent}
        </TabsContent>
      </div>
    </Tabs>
  )
}
