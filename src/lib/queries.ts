import {
  getLiveFixtures,
  getFixturesByDate,
  getFixtureById,
  getHeadToHead,
  getStandingsBySeason,
  getOddsByFixture,
  getTodayDate,
} from "@/lib/api/football-api";
import type { HomePageData, MatchDetailData } from "@/types/football";

/**
 * Get home page data
 * Fetches live fixtures and today's fixtures
 */
export async function getHomePageData(): Promise<HomePageData> {
  const today = getTodayDate();

  // Fetch both in parallel
  const [liveFixtures, todayFixtures] = await Promise.all([
    getLiveFixtures().catch(() => []),
    getFixturesByDate(today).catch(() => []),
  ]);

  // Filter out live fixtures from today's fixtures to avoid duplicates
  const liveIds = new Set(liveFixtures.map((f) => f.id));
  const nonLiveTodayFixtures = todayFixtures.filter((f) => !liveIds.has(f.id));

  return {
    liveFixtures,
    todayFixtures: nonLiveTodayFixtures,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Get match detail page data
 * Fetches fixture, h2h, standings, and odds in parallel
 */
export async function getMatchDetailData(fixtureId: number): Promise<MatchDetailData> {
  // First get fixture to know season and teams
  const fixture = await getFixtureById(fixtureId);

  // Then fetch additional data in parallel
  const [h2h, standings, odds] = await Promise.all([
    getHeadToHead(fixture.homeTeam.id, fixture.awayTeam.id).catch(() => []),
    fixture.seasonId
      ? getStandingsBySeason(fixture.seasonId).catch(() => [])
      : Promise.resolve([]),
    getOddsByFixture(fixtureId).catch(() => null),
  ]);

  return {
    fixture,
    standings,
    h2h,
    odds,
  };
}
