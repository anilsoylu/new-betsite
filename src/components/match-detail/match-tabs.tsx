"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsTab } from "./events-tab";
import { StatisticsTab } from "./statistics-tab";
import { LineupsTab } from "./lineups-tab";
import { StandingsTab } from "./standings-tab";
import { H2HTab } from "./h2h-tab";
import { useLiveFixture } from "@/hooks";
import type {
  FixtureDetail,
  StandingTable,
  H2HFixture,
} from "@/types/football";

interface MatchTabsProps {
  fixture: FixtureDetail;
  standings: Array<StandingTable>;
  h2h: Array<H2HFixture>;
}

export function MatchTabs({ fixture, standings, h2h }: MatchTabsProps) {
  const hasEvents = fixture.events.length > 0;
  const hasStatistics = fixture.statistics.length > 0;
  const hasLineups = fixture.homeLineup || fixture.awayLineup;
  const hasStandings = standings.length > 0;
  const hasH2H = h2h.length > 0;

  // Determine default tab based on available data
  const getDefaultTab = () => {
    // For live/finished matches, prioritize events
    if (hasEvents) return "events";
    if (hasLineups) return "lineups";
    if (hasStatistics) return "statistics";
    if (hasStandings) return "standings";
    if (hasH2H) return "h2h";
    return "lineups";
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab);

  return (
    <Tabs
      defaultValue={getDefaultTab()}
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="w-full grid grid-cols-5 mb-4">
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="lineups">Lineups</TabsTrigger>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
        <TabsTrigger value="standings">Standings</TabsTrigger>
        <TabsTrigger value="h2h">H2H</TabsTrigger>
      </TabsList>

      <TabsContent value="events">
        <EventsTab
          events={fixture.events}
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
          />
        ) : (
          <EmptyState message="Lineups not announced yet" />
        )}
      </TabsContent>

      <TabsContent value="statistics">
        {hasStatistics ? (
          <StatisticsTab
            statistics={fixture.statistics}
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
