"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLiveFixture } from "@/hooks/use-live-fixture";
import type {
  Fixture,
  MatchEvent,
  MatchStatistic,
  MatchStatus,
} from "@/types/football";

interface LiveFixtureContextValue {
  status: MatchStatus;
  minute: number | null;
  displayMinute: string | null;
  homeScore: number;
  awayScore: number;
  isLive: boolean;
  events: MatchEvent[];
  statistics: MatchStatistic[];
}

const LiveFixtureContext = createContext<LiveFixtureContextValue | null>(null);

interface LiveFixtureProviderProps {
  fixture: Fixture;
  children: ReactNode;
}

export function LiveFixtureProvider({
  fixture,
  children,
}: LiveFixtureProviderProps) {
  const liveData = useLiveFixture({ fixture, pollInterval: 30000 });

  return (
    <LiveFixtureContext.Provider value={liveData}>
      {children}
    </LiveFixtureContext.Provider>
  );
}

export function useLiveFixtureContext() {
  const context = useContext(LiveFixtureContext);
  if (!context) {
    throw new Error(
      "useLiveFixtureContext must be used within LiveFixtureProvider",
    );
  }
  return context;
}
