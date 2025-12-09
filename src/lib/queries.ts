import {
  getLiveFixtures,
  getFixturesByDate,
  getFixtureById,
  getHeadToHead,
  getStandingsBySeason,
  getOddsByFixture,
  getTodayDate,
  getLeagueById,
  getFixturesByTeam,
} from "@/lib/api/football-api";
import { TOP_LEAGUES } from "@/components/sidebar/top-leagues";
import type { HomePageData, MatchDetailData, Standing } from "@/types/football";

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
 * Fetches fixture, h2h, standings, odds, and team form in parallel
 */
export async function getMatchDetailData(fixtureId: number): Promise<MatchDetailData> {
  // First get fixture to know season and teams
  const fixture = await getFixtureById(fixtureId);

  // Then fetch additional data in parallel
  const [h2h, standings, odds, homeTeamFixtures, awayTeamFixtures] = await Promise.all([
    getHeadToHead(fixture.homeTeam.id, fixture.awayTeam.id).catch(() => []),
    fixture.seasonId
      ? getStandingsBySeason(fixture.seasonId).catch(() => [])
      : Promise.resolve([]),
    getOddsByFixture(fixtureId).catch(() => null),
    getFixturesByTeam(fixture.homeTeam.id, { past: 5 }).catch(() => ({ recent: [], upcoming: [] })),
    getFixturesByTeam(fixture.awayTeam.id, { past: 5 }).catch(() => ({ recent: [], upcoming: [] })),
  ]);

  // Convert recent fixtures to form data for each team
  const homeForm = homeTeamFixtures.recent.map((f) => ({
    homeScore: f.score?.home ?? null,
    awayScore: f.score?.away ?? null,
    isHome: f.homeTeam.id === fixture.homeTeam.id,
  }));

  const awayForm = awayTeamFixtures.recent.map((f) => ({
    homeScore: f.score?.home ?? null,
    awayScore: f.score?.away ?? null,
    isHome: f.homeTeam.id === fixture.awayTeam.id,
  }));

  return {
    fixture,
    standings,
    h2h,
    odds,
    homeForm,
    awayForm,
  };
}

// Use TOP_LEAGUES from sidebar component for consistency
// Include all leagues/tournaments - API will return standings if available
const STANDINGS_LEAGUES = TOP_LEAGUES;

export interface LeagueStandingsData {
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  standings: Standing[];
}

/**
 * Get standings for top leagues (for sidebar widget)
 * Fetches current season standings for all domestic leagues in parallel
 */
export async function getTopLeaguesStandings(): Promise<LeagueStandingsData[]> {
  // Fetch all leagues in parallel
  const leaguePromises = STANDINGS_LEAGUES.map(async (league) => {
    try {
      const leagueData = await getLeagueById(league.id);

      if (!leagueData.currentSeasonId) {
        console.log(`[Standings] ${league.name}: No current season`);
        return null;
      }

      const standings = await getStandingsBySeason(leagueData.currentSeasonId);

      if (standings.length > 0 && standings[0].standings.length > 0) {
        return {
          leagueId: league.id,
          leagueName: league.name,
          leagueLogo: league.logo,
          standings: standings[0].standings,
        };
      }

      console.log(`[Standings] ${league.name}: No standings data`);
      return null;
    } catch {
      // Silently skip leagues without active seasons or API access (e.g., World Cup between tournaments)
      return null;
    }
  });

  const results = await Promise.all(leaguePromises);
  return results.filter((r): r is LeagueStandingsData => r !== null);
}
