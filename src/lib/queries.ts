import {
  getLiveFixtures,
  getFixturesByDate,
  getFixtureById,
  getHeadToHead,
  getStandingsBySeason,
  getOddsByFixture,
  getTodayDate,
  getLeagueById,
} from "@/lib/api/football-api";
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

// League IDs for sidebar standings (Sportmonks IDs)
const SIDEBAR_LEAGUES = [
  { id: 8, name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png" },
  { id: 564, name: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png" },
  { id: 82, name: "Bundesliga", logo: "https://media.api-sports.io/football/leagues/78.png" },
  { id: 384, name: "Serie A", logo: "https://media.api-sports.io/football/leagues/135.png" },
  { id: 301, name: "Ligue 1", logo: "https://media.api-sports.io/football/leagues/61.png" },
];

export interface LeagueStandingsData {
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  standings: Standing[];
}

/**
 * Get standings for top leagues (for sidebar widget)
 * Fetches current season standings for major leagues in parallel
 */
export async function getTopLeaguesStandings(): Promise<LeagueStandingsData[]> {
  // Fetch all leagues in parallel
  const leaguePromises = SIDEBAR_LEAGUES.map(async (league) => {
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
    } catch (error) {
      console.error(`[Standings] Failed for ${league.name}:`, error);
      return null;
    }
  });

  const results = await Promise.all(leaguePromises);
  return results.filter((r): r is LeagueStandingsData => r !== null);
}
