"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Fixture,
  MatchStatus,
  MatchEvent,
  MatchStatistic,
} from "@/types/football";

interface LiveFixtureData {
  status: MatchStatus;
  minute: number | null;
  timeAdded: number | null;
  periodLength: number;
  homeScore: number;
  awayScore: number;
  isLive: boolean;
  /** Formatted minute string like "45+2'" or "67'" */
  displayMinute: string | null;
  /** Live events (goals, cards, substitutions) */
  events: MatchEvent[];
  /** Live statistics */
  statistics: MatchStatistic[];
}

interface UseLiveFixtureOptions {
  fixture: Fixture;
  /** Polling interval in milliseconds (default: 30000 = 30 seconds) */
  pollInterval?: number;
  /** Whether to enable polling (default: true for live matches) */
  enabled?: boolean;
}

/**
 * Format minute display with added time support
 * Only shows "45+X'" or "90+X'" when API provides explicit time_added
 */
function formatMinuteDisplay(
  minute: number | null,
  timeAdded: number | null,
): string | null {
  if (minute === null) return null;

  // ONLY show added time format when API explicitly provides time_added
  if (timeAdded !== null && timeAdded > 0) {
    // Determine base minute: 45 for 1st half injury time, 90 for 2nd half
    const baseMinute = minute <= 50 ? 45 : 90;
    return `${baseMinute}+${timeAdded}'`;
  }

  // Normal minute display
  return `${minute}'`;
}

/**
 * Hook that polls for live fixture updates from /livescores/inplay endpoint.
 *
 * - Only polls when match is live (isLive: true)
 * - Fetches fresh data every pollInterval
 * - Returns updated status, minute (with added time), and scores
 */
export function useLiveFixture({
  fixture,
  pollInterval = 30000,
  enabled = true,
}: UseLiveFixtureOptions): LiveFixtureData {
  const [data, setData] = useState<LiveFixtureData>(() => ({
    status: fixture.status,
    minute: fixture.minute,
    timeAdded: null,
    periodLength: 45,
    homeScore: fixture.score?.home ?? 0,
    awayScore: fixture.score?.away ?? 0,
    isLive: fixture.isLive,
    displayMinute: fixture.minute ? `${fixture.minute}'` : null,
    events: [],
    statistics: [],
  }));

  // Only poll if match is currently live
  const shouldPoll = enabled && data.isLive;

  const fetchUpdate = useCallback(async () => {
    try {
      const response = await fetch(`/api/fixtures/${fixture.id}/live`);
      if (!response.ok) return;

      const update = await response.json();

      // If fixture not found in live matches, it might have ended
      if (update.status === "unknown") {
        return;
      }

      const displayMinute = formatMinuteDisplay(
        update.minute,
        update.timeAdded,
      );

      setData({
        status: update.status as MatchStatus,
        minute: update.minute,
        timeAdded: update.timeAdded,
        periodLength: update.periodLength || 45,
        homeScore: update.homeScore,
        awayScore: update.awayScore,
        isLive: update.isLive,
        displayMinute,
        events: update.events || [],
        statistics: update.statistics || [],
      });
    } catch {
      // Silent fail - keep showing last known data
    }
  }, [fixture.id]);

  // Reset state ONLY when navigating to a different fixture
  useEffect(() => {
    setData({
      status: fixture.status,
      minute: fixture.minute,
      timeAdded: null,
      periodLength: 45,
      homeScore: fixture.score?.home ?? 0,
      awayScore: fixture.score?.away ?? 0,
      isLive: fixture.isLive,
      displayMinute: fixture.minute ? `${fixture.minute}'` : null,
      events: [],
      statistics: [],
    });
  }, [fixture.id]); // Intentionally only fixture.id - live data updates via polling

  // Poll for updates
  useEffect(() => {
    if (!shouldPoll) return;

    // Fetch immediately on mount
    fetchUpdate();

    // Then poll at interval
    const interval = setInterval(fetchUpdate, pollInterval);

    return () => clearInterval(interval);
  }, [shouldPoll, pollInterval, fetchUpdate]);

  return data;
}
