"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsTab } from "./events-tab";
import { StatisticsTab } from "./statistics-tab";
import { LineupsTab } from "./lineups-tab";
import { StandingsTab } from "./standings-tab";
import { H2HTab } from "./h2h-tab";
import type {
  FixtureDetail,
  StandingTable,
  H2HFixture,
} from "@/types/football";
import { useLiveFixtureContext } from "./live-fixture-provider";

export type MatchTab =
  | "events"
  | "lineups"
  | "statistics"
  | "standings"
  | "h2h";

const VALID_TABS: MatchTab[] = [
  "events",
  "lineups",
  "statistics",
  "standings",
  "h2h",
];

const TAB_LABELS: Record<MatchTab, string> = {
  events: "Events",
  lineups: "Lineups",
  statistics: "Statistics",
  standings: "Standings",
  h2h: "H2H",
};

interface MatchTabsProps {
  fixture: FixtureDetail;
  standings: Array<StandingTable>;
  h2h: Array<H2HFixture>;
}

export function MatchTabs({ fixture, standings, h2h }: MatchTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get live data from context (polling handled by provider)
  const { events: liveEvents, statistics: liveStatistics } =
    useLiveFixtureContext();

  // Use live data if available, otherwise fall back to static fixture data
  const currentEvents = liveEvents.length > 0 ? liveEvents : fixture.events;
  const currentStatistics =
    liveStatistics.length > 0 ? liveStatistics : fixture.statistics;

  const hasEvents = currentEvents.length > 0;
  const hasStatistics = currentStatistics.length > 0;
  const hasLineups = fixture.homeLineup || fixture.awayLineup;
  const hasStandings = standings.length > 0;
  const hasH2H = h2h.length > 0;

  // Determine default tab based on available data
  const getDefaultTab = (): MatchTab => {
    // For live/finished matches, prioritize events
    if (hasEvents) return "events";
    if (hasLineups) return "lineups";
    if (hasStatistics) return "statistics";
    if (hasStandings) return "standings";
    if (hasH2H) return "h2h";
    return "lineups";
  };

  // Get initial tab from URL or use smart default
  const getInitialTab = (): MatchTab => {
    const tabParam = searchParams.get("tab");
    if (tabParam && VALID_TABS.includes(tabParam as MatchTab)) {
      return tabParam as MatchTab;
    }
    return getDefaultTab();
  };

  const [activeTab, setActiveTab] = useState<MatchTab>(getInitialTab);

  // Sync with URL on mount and when searchParams change
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && VALID_TABS.includes(tabParam as MatchTab)) {
      setActiveTab(tabParam as MatchTab);
    } else if (!tabParam) {
      setActiveTab(getDefaultTab());
    }
  }, [
    searchParams,
    hasEvents,
    hasLineups,
    hasStatistics,
    hasStandings,
    hasH2H,
  ]);

  // Update URL without triggering navigation (pure client-side)
  const handleTabChange = useCallback(
    (value: string) => {
      const newTab = value as MatchTab;
      setActiveTab(newTab);

      // Build new URL
      const params = new URLSearchParams(searchParams.toString());
      const defaultTab = getDefaultTab();

      if (newTab === defaultTab) {
        // Remove param if it's the default tab (cleaner URL)
        params.delete("tab");
      } else {
        params.set("tab", newTab);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      // Update URL without navigation (no page reload, no router)
      window.history.replaceState(null, "", newUrl);
    },
    [
      pathname,
      searchParams,
      hasEvents,
      hasLineups,
      hasStatistics,
      hasStandings,
      hasH2H,
    ],
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full inline-flex md:grid md:grid-cols-5 min-w-max md:min-w-0">
        {VALID_TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab} className="text-sm w-full">
            {TAB_LABELS[tab]}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="events">
        <EventsTab
          events={currentEvents}
          homeTeam={fixture.homeTeam}
          awayTeam={fixture.awayTeam}
        />
      </TabsContent>

      <TabsContent value="lineups">
        {hasLineups ? (
          <LineupsTab
            homeLineup={fixture.homeLineup}
            awayLineup={fixture.awayLineup}
            homeTeam={fixture.homeTeam}
            awayTeam={fixture.awayTeam}
            homeCoach={fixture.homeCoach}
            awayCoach={fixture.awayCoach}
          />
        ) : (
          <EmptyState message="Lineups not announced yet" />
        )}
      </TabsContent>

      <TabsContent value="statistics">
        {hasStatistics ? (
          <StatisticsTab
            statistics={currentStatistics}
            homeTeam={fixture.homeTeam}
            awayTeam={fixture.awayTeam}
          />
        ) : (
          <EmptyState message="No statistics available yet" />
        )}
      </TabsContent>

      <TabsContent value="standings">
        {hasStandings ? (
          <StandingsTab
            standings={standings}
            homeTeamId={fixture.homeTeam.id}
            awayTeamId={fixture.awayTeam.id}
          />
        ) : (
          <EmptyState message="No standings available" />
        )}
      </TabsContent>

      <TabsContent value="h2h">
        {hasH2H ? (
          <H2HTab
            h2h={h2h}
            homeTeamId={fixture.homeTeam.id}
            awayTeamId={fixture.awayTeam.id}
          />
        ) : (
          <EmptyState message="No head-to-head history" />
        )}
      </TabsContent>
    </Tabs>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center text-muted-foreground">
      <p>{message}</p>
    </div>
  );
}
