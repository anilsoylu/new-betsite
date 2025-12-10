"use client";

import { useState } from "react";
import { LeagueTabs, type LeagueTab } from "./league-tabs";
import { TopScorersCard } from "./top-scorers-card";
import { FixturesCard } from "./fixtures-card";
import { StandingsTable } from "./standings-table";
import { LeagueAboutSection } from "./league-about-section";
import type { LeaguePageData } from "@/types/football";

interface LeagueContentProps {
  data: LeaguePageData;
}

export function LeagueContent({ data }: LeagueContentProps) {
  const [activeTab, setActiveTab] = useState<LeagueTab>("overview");

  const hasStandings =
    data.standings.length > 0 && data.standings[0].standings.length > 0;
  const standings = hasStandings ? data.standings[0].standings : [];

  return (
    <div>
      {/* Tabs */}
      <LeagueTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasStandings={hasStandings}
      />

      {/* Tab Content */}
      <div className="mt-6">
        {/* Overview Tab - 2 Column Layout */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Live Matches */}
              {data.liveFixtures.length > 0 && (
                <FixturesCard
                  title="Live Now"
                  fixtures={data.liveFixtures}
                  type="live"
                />
              )}

              {/* Upcoming Matches */}
              <FixturesCard
                title="Upcoming Matches"
                fixtures={data.upcomingFixtures}
                type="upcoming"
                onViewAll={() => setActiveTab("fixtures")}
              />

              {/* Recent Results */}
              <FixturesCard
                title="Recent Results"
                fixtures={data.recentFixtures}
                type="recent"
                onViewAll={() => setActiveTab("fixtures")}
              />

              {/* Mini Standings (mobile) */}
              {hasStandings && (
                <div className="lg:hidden">
                  <h3 className="font-semibold mb-3">Standings</h3>
                  <StandingsTable standings={standings.slice(0, 6)} compact />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block space-y-6">
              {/* Mini Standings */}
              {hasStandings && (
                <StandingsTable standings={standings.slice(0, 8)} compact />
              )}

              {/* Top Scorers */}
              <TopScorersCard
                title="Top Scorers"
                type="goals"
                scorers={data.topScorers}
                onViewAll={() => setActiveTab("stats")}
              />

              {/* Top Assists */}
              <TopScorersCard
                title="Top Assists"
                type="assists"
                scorers={data.topAssists}
                onViewAll={() => setActiveTab("stats")}
              />
            </div>
          </div>
        )}

        {/* Standings Tab - Full Width */}
        {activeTab === "standings" && (
          <div className="space-y-6">
            {hasStandings ? (
              <StandingsTable standings={standings} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No standings available for this competition
              </div>
            )}
          </div>
        )}

        {/* Fixtures Tab - Full Width */}
        {activeTab === "fixtures" && (
          <div className="grid md:grid-cols-2 gap-6">
            <FixturesCard
              title="Upcoming Matches"
              fixtures={data.upcomingFixtures}
              type="upcoming"
            />
            <FixturesCard
              title="Recent Results"
              fixtures={data.recentFixtures}
              type="recent"
            />
          </div>
        )}

        {/* Stats Tab - Full Width */}
        {activeTab === "stats" && (
          <div className="grid md:grid-cols-2 gap-6">
            <TopScorersCard
              title="Top Scorers"
              type="goals"
              scorers={data.topScorers}
            />
            <TopScorersCard
              title="Top Assists"
              type="assists"
              scorers={data.topAssists}
            />
          </div>
        )}
      </div>

      {/* About Section - Always visible below tabs, full width */}
      <div className="mt-8">
        <LeagueAboutSection
          league={data.league}
          standings={standings}
          topScorers={data.topScorers}
          recentFixtures={data.recentFixtures}
        />
      </div>
    </div>
  );
}
