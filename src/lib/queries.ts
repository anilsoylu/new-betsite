// Using cached-football-api for automatic sitemap cache population
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
  getTeamsBySeason,
  getTopScorersBySeason,
} from "@/lib/api/cached-football-api";
import type { TopScorer, Country } from "@/types/football";
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
export async function getMatchDetailData(
  fixtureId: number,
): Promise<MatchDetailData> {
  // First get fixture to know season and teams
  const fixture = await getFixtureById(fixtureId);

  // Then fetch additional data in parallel
  const [h2h, standings, odds, homeTeamFixtures, awayTeamFixtures] =
    await Promise.all([
      getHeadToHead(fixture.homeTeam.id, fixture.awayTeam.id).catch(() => []),
      fixture.seasonId
        ? getStandingsBySeason(fixture.seasonId).catch(() => [])
        : Promise.resolve([]),
      getOddsByFixture(fixtureId).catch(() => null),
      getFixturesByTeam(fixture.homeTeam.id, { past: 5 }).catch(() => ({
        recent: [],
        upcoming: [],
      })),
      getFixturesByTeam(fixture.awayTeam.id, { past: 5 }).catch(() => ({
        recent: [],
        upcoming: [],
      })),
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
 * Optimized: Fetches all league metadata in parallel first, then standings in parallel
 * This leverages cache effectively - league metadata has 6hr cache
 */
export async function getTopLeaguesStandings(): Promise<LeagueStandingsData[]> {
  // Step 1: Fetch all league metadata in parallel (leverages 6hr cache)
  const leagueDataResults = await Promise.all(
    STANDINGS_LEAGUES.map((league) =>
      getLeagueById(league.id)
        .then((data) => ({ league, data, error: null }))
        .catch(() => ({ league, data: null, error: true })),
    ),
  );

  // Step 2: Filter leagues with valid current seasons
  const leaguesWithSeasons = leagueDataResults.filter(
    (
      r,
    ): r is {
      league: (typeof STANDINGS_LEAGUES)[number];
      data: NonNullable<typeof r.data>;
      error: null;
    } => r.data !== null && r.data.currentSeasonId !== undefined,
  );

  // Step 3: Fetch all standings in parallel (leverages 1hr cache)
  const standingsResults = await Promise.all(
    leaguesWithSeasons.map(({ league, data }) =>
      getStandingsBySeason(data.currentSeasonId!)
        .then((standings) => ({ league, standings }))
        .catch(() => ({ league, standings: [] })),
    ),
  );

  // Step 4: Build final result
  return standingsResults
    .filter(
      ({ standings }) =>
        standings.length > 0 && standings[0].standings.length > 0,
    )
    .map(({ league, standings }) => ({
      leagueId: league.id,
      leagueName: league.name,
      leagueLogo: league.logo,
      standings: standings[0].standings,
    }));
}

// League teams data type
export interface LeagueTeamsData {
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  teams: Array<{
    id: number;
    name: string;
    shortCode: string | null;
    logo: string;
    country: Country | null;
  }>;
}

// Leagues to show on teams page
const TEAMS_PAGE_LEAGUES = [
  {
    id: 8,
    name: "Premier League",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/8/8.png",
  },
  {
    id: 564,
    name: "La Liga",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/20/564.png",
  },
  {
    id: 82,
    name: "Bundesliga",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/18/82.png",
  },
  {
    id: 384,
    name: "Serie A",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/0/384.png",
  },
  {
    id: 301,
    name: "Ligue 1",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/13/301.png",
  },
  {
    id: 600,
    name: "Süper Lig",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/24/600.png",
  },
];

/**
 * Get teams for popular leagues
 * Optimized: Fetches all league metadata in parallel first, then teams in parallel
 */
export async function getTeamsForPopularLeagues(): Promise<LeagueTeamsData[]> {
  // Step 1: Fetch all league metadata in parallel (leverages 6hr cache)
  const leagueDataResults = await Promise.all(
    TEAMS_PAGE_LEAGUES.map((league) =>
      getLeagueById(league.id)
        .then((data) => ({ league, data }))
        .catch(() => ({ league, data: null })),
    ),
  );

  // Step 2: Filter leagues with valid current seasons
  const leaguesWithSeasons = leagueDataResults.filter(
    (
      r,
    ): r is {
      league: (typeof TEAMS_PAGE_LEAGUES)[number];
      data: NonNullable<typeof r.data>;
    } => r.data !== null && r.data.currentSeasonId !== undefined,
  );

  // Step 3: Fetch all teams in parallel (leverages 6hr cache)
  const teamsResults = await Promise.all(
    leaguesWithSeasons.map(({ league, data }) =>
      getTeamsBySeason(data.currentSeasonId!)
        .then((teams) => ({ league, teams }))
        .catch(() => ({ league, teams: [] })),
    ),
  );

  // Step 4: Build final result
  return teamsResults
    .filter(({ teams }) => teams.length > 0)
    .map(({ league, teams }) => ({
      leagueId: league.id,
      leagueName: league.name,
      leagueLogo: league.logo,
      teams: teams.map((t) => ({
        id: t.id,
        name: t.name,
        shortCode: t.shortCode,
        logo: t.logo,
        country: t.country,
      })),
    }));
}

// League topscorers data type
export interface LeagueTopScorersData {
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  topScorers: TopScorer[];
}

// Leagues to show topscorers from (same as teams page)
const TOPSCORERS_LEAGUES = [
  {
    id: 8,
    name: "Premier League",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/8/8.png",
  },
  {
    id: 564,
    name: "La Liga",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/20/564.png",
  },
  {
    id: 82,
    name: "Bundesliga",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/18/82.png",
  },
  {
    id: 384,
    name: "Serie A",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/0/384.png",
  },
  {
    id: 301,
    name: "Ligue 1",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/13/301.png",
  },
  {
    id: 600,
    name: "Süper Lig",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/24/600.png",
  },
];

/**
 * Get top scorers for popular leagues
 * Optimized: Fetches all league metadata in parallel first, then top scorers in parallel
 */
export async function getTopScorersForPopularLeagues(): Promise<
  LeagueTopScorersData[]
> {
  // Step 1: Fetch all league metadata in parallel (leverages 6hr cache)
  const leagueDataResults = await Promise.all(
    TOPSCORERS_LEAGUES.map((league) =>
      getLeagueById(league.id)
        .then((data) => ({ league, data }))
        .catch(() => ({ league, data: null })),
    ),
  );

  // Step 2: Filter leagues with valid current seasons
  const leaguesWithSeasons = leagueDataResults.filter(
    (
      r,
    ): r is {
      league: (typeof TOPSCORERS_LEAGUES)[number];
      data: NonNullable<typeof r.data>;
    } => r.data !== null && r.data.currentSeasonId !== undefined,
  );

  // Step 3: Fetch all top scorers in parallel (leverages 5min cache)
  const scorersResults = await Promise.all(
    leaguesWithSeasons.map(({ league, data }) =>
      getTopScorersBySeason(data.currentSeasonId!, "goals", 10)
        .then((topScorers) => ({ league, topScorers }))
        .catch(() => ({ league, topScorers: [] })),
    ),
  );

  // Step 4: Build final result
  return scorersResults
    .filter(({ topScorers }) => topScorers.length > 0)
    .map(({ league, topScorers }) => ({
      leagueId: league.id,
      leagueName: league.name,
      leagueLogo: league.logo,
      topScorers,
    }));
}
