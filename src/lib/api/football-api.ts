import { z } from "zod";
import {
  sportmonksRequest,
  sportmonksPaginatedRequest,
} from "./sportmonks-client";
import {
  mapFixture,
  mapFixtureDetail,
  mapLeague,
  mapLeagueWithCurrentSeason,
  mapStandingsToTables,
  mapH2HFixture,
  mapMatchOdds,
  mapTeamDetail,
  mapTeamSearchResult,
  mapPlayerDetail,
  mapPlayerSearchResult,
  mapTopScorer,
  mapTeamTransfer,
  mapCoachDetail,
  mapCoachSearchResult,
} from "./sportmonks-mappers";
import type {
  SportmonksFixtureRaw,
  SportmonksLeagueRaw,
  SportmonksLeagueWithCurrentSeasonRaw,
  SportmonksStandingRaw,
  SportmonksOddRaw,
  SportmonksTeamRaw,
  SportmonksPlayerRaw,
  SportmonksTopScorerRaw,
  SportmonksTransferRaw,
  SportmonksCoachDetailRaw,
  SportmonksCoachRaw,
} from "@/types/sportmonks/raw";
import type {
  Fixture,
  FixtureDetail,
  League,
  Standing,
  StandingTable,
  H2HFixture,
  MatchOdds,
  MarketOdds,
  TeamDetail,
  TeamSearchResult,
  PlayerDetail,
  PlayerSearchResult,
  TopScorer,
  LeaguePageData,
  TeamTransfer,
  CoachDetail,
  CoachSearchResult,
} from "@/types/football";
import { API, UI } from "@/lib/constants";

// Validation schemas
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format");
const idSchema = z.number().int().positive();

// Default includes for fixtures
const FIXTURE_INCLUDES = [
  "participants",
  "scores",
  "state",
  "league",
  "periods",
];
const FIXTURE_DETAIL_INCLUDES = [
  "participants",
  "scores",
  "state",
  "league",
  "venue",
  "events",
  "statistics",
  "statistics.type",
  "lineups",
  "lineups.player",
  "periods",
  "formations",
  "referees.referee",
  "coaches",
  "sidelined.sideline.player", // Player injuries/suspensions
];

// H2H includes
const H2H_INCLUDES = ["participants", "scores", "state", "league"];

// Betting markets configuration
// Market IDs from Sportmonks API
export const BETTING_MARKETS = {
  FULLTIME_RESULT: { id: 1, name: "Full Time Result", labels: ["1", "X", "2"] },
  DOUBLE_CHANCE: { id: 12, name: "Double Chance", labels: ["1X", "12", "X2"] },
  OVER_UNDER_2_5: { id: 18, name: "Over/Under 2.5", labels: ["Over", "Under"] },
  BTTS: { id: 28, name: "Both Teams To Score", labels: ["Yes", "No"] },
  OVER_UNDER_1_5: { id: 16, name: "Over/Under 1.5", labels: ["Over", "Under"] },
  OVER_UNDER_3_5: { id: 19, name: "Over/Under 3.5", labels: ["Over", "Under"] },
  DRAW_NO_BET: { id: 6, name: "Draw No Bet", labels: ["1", "2"] },
  ASIAN_HANDICAP_0: { id: 3, name: "Asian Handicap 0", labels: ["1", "2"] },
} as const;

// Get all market IDs for fetching
export const ALL_MARKET_IDS = Object.values(BETTING_MARKETS).map((m) => m.id);

// Concurrency limit for multi-market odds fetching
const ODDS_CONCURRENCY_LIMIT = 4;

/**
 * Get live (in-play) fixtures
 * Endpoint: GET /livescores/inplay
 * Note: This endpoint does not support pagination
 * Cache: live (30s) - real-time score data
 */
export async function getLiveFixtures(): Promise<Array<Fixture>> {
  const response = await sportmonksRequest<Array<SportmonksFixtureRaw>>({
    endpoint: "/livescores/inplay",
    include: FIXTURE_INCLUDES,
    cache: "live",
  });

  // Handle case when no live fixtures (API returns undefined/null)
  const fixtures = (response.data ?? []).map(mapFixture);
  return fixtures.slice(0, UI.fixtures.maxLiveFixtures);
}

/**
 * Get fixtures by date (max fixtures for homepage)
 * Endpoint: GET /fixtures/date/{date}
 * Cache: short (5min) - today's schedule changes occasionally
 */
export async function getFixturesByDate(
  date?: string,
): Promise<Array<Fixture>> {
  const targetDate = date || new Date().toISOString().split("T")[0];
  dateSchema.parse(targetDate);

  const allFixtures: Array<Fixture> = [];
  let currentPage = 1;
  let hasMore = true;
  const maxFixtures = UI.fixtures.maxHomePageFixtures;

  while (hasMore && allFixtures.length < maxFixtures) {
    const response = await sportmonksPaginatedRequest<SportmonksFixtureRaw>({
      endpoint: `/fixtures/date/${targetDate}`,
      include: FIXTURE_INCLUDES,
      page: currentPage,
      perPage: API.sportmonks.defaultPerPage,
      cache: "short",
    });

    allFixtures.push(...response.data.map(mapFixture));
    hasMore = response.pagination.has_more;
    currentPage++;
  }

  return allFixtures.slice(0, maxFixtures);
}

/**
 * Get single fixture by ID with full details
 * Endpoint: GET /fixtures/{id}
 * Cache: short (5min) - match details can change during game
 */
export async function getFixtureById(
  fixtureId: number,
): Promise<FixtureDetail> {
  idSchema.parse(fixtureId);

  const response = await sportmonksRequest<SportmonksFixtureRaw>({
    endpoint: `/fixtures/${fixtureId}`,
    include: FIXTURE_DETAIL_INCLUDES,
    cache: "short",
  });

  return mapFixtureDetail(response.data);
}

/**
 * Get head-to-head fixtures between two teams
 * Endpoint: GET /fixtures/head-to-head/{homeId}/{awayId}
 * Cache: long (6hr) - historical data rarely changes
 */
export async function getHeadToHead(
  homeId: number,
  awayId: number,
): Promise<Array<H2HFixture>> {
  idSchema.parse(homeId);
  idSchema.parse(awayId);

  try {
    const response = await sportmonksPaginatedRequest<SportmonksFixtureRaw>({
      endpoint: `/fixtures/head-to-head/${homeId}/${awayId}`,
      include: H2H_INCLUDES,
      perPage: 10,
      cache: "long",
    });

    return response.data.map(mapH2HFixture);
  } catch {
    return [];
  }
}

/**
 * Get pre-match odds for a fixture (1X2 market only)
 * Endpoint: GET /odds/pre-match/fixtures/{fixtureId}/markets/1
 * Using market filter reduces response from ~2MB to ~50KB
 * Cache: short (5min) - odds change frequently
 */
export async function getOddsByFixture(
  fixtureId: number,
): Promise<MatchOdds | null> {
  idSchema.parse(fixtureId);

  try {
    // Market ID 1 = 1X2 (Full Time Result) - only fetch this market
    // This dramatically reduces response size from ~2.3MB to ~50KB
    const response = await sportmonksPaginatedRequest<SportmonksOddRaw>({
      endpoint: `/odds/pre-match/fixtures/${fixtureId}/markets/1`,
      include: ["bookmaker"],
      perPage: 50,
      cache: "short",
    });

    return mapMatchOdds(response.data);
  } catch {
    return null;
  }
}

/**
 * Get pre-match odds for multiple markets
 * Uses concurrency limiting to avoid rate limits
 * Returns array of MarketOdds for all requested markets
 * Cache: short (5min) - odds change frequently
 */
export async function getOddsByFixtureMultiMarket(
  fixtureId: number,
  marketIds: readonly number[] = ALL_MARKET_IDS,
): Promise<Array<MarketOdds>> {
  idSchema.parse(fixtureId);

  // Process markets in batches with concurrency limit
  const results: Array<MarketOdds> = [];

  // Split market IDs into chunks
  const chunks: number[][] = [];
  for (let i = 0; i < marketIds.length; i += ODDS_CONCURRENCY_LIMIT) {
    chunks.push(marketIds.slice(i, i + ODDS_CONCURRENCY_LIMIT) as number[]);
  }

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map(async (marketId) => {
        try {
          const response = await sportmonksPaginatedRequest<SportmonksOddRaw>({
            endpoint: `/odds/pre-match/fixtures/${fixtureId}/markets/${marketId}`,
            include: ["bookmaker", "market"],
            perPage: 50,
            cache: "short",
          });

          return mapMarketOdds(response.data, marketId);
        } catch {
          return null;
        }
      }),
    );

    // Filter out null results and add to results array
    results.push(
      ...(chunkResults.filter((r): r is MarketOdds => r !== null)),
    );
  }

  return results;
}

/**
 * Map raw odds data to MarketOdds
 */
function mapMarketOdds(
  odds: Array<SportmonksOddRaw>,
  marketId: number,
): MarketOdds | null {
  if (!odds || odds.length === 0) return null;

  // Get market name from first odd with market info, or from our config
  const marketConfig = Object.values(BETTING_MARKETS).find(
    (m) => m.id === marketId,
  );
  const marketName =
    odds[0]?.market?.name || marketConfig?.name || `Market ${marketId}`;

  // Group odds by label and get best value for each
  const oddsMap = new Map<
    string,
    {
      label: string;
      value: number;
      probability: number | null;
      total?: string | null;
      handicap?: string | null;
    }
  >();

  for (const odd of odds) {
    if (odd.stopped) continue;

    const existing = oddsMap.get(odd.label);
    const value = parseFloat(odd.value);

    // Keep the best odds (highest value) for each label
    if (!existing || value > existing.value) {
      oddsMap.set(odd.label, {
        label: odd.label,
        value,
        probability: odd.probability ? parseFloat(odd.probability) : null,
        total: odd.total || null,
        handicap: odd.handicap || null,
      });
    }
  }

  if (oddsMap.size === 0) return null;

  // Get bookmaker name and updated time from first available
  const firstOdd = odds.find((o) => o.bookmaker);

  return {
    marketId,
    marketName,
    odds: Array.from(oddsMap.values()),
    bookmaker: firstOdd?.bookmaker?.name || null,
    updatedAt: firstOdd?.updated_at || null,
  };
}

/**
 * Get standings by season
 * Endpoint: GET /standings/seasons/{seasonId}
 * Returns flat array of standing entries, not grouped
 * Cache: medium (1hr) - standings update after matches
 */
export async function getStandingsBySeason(
  seasonId: number,
): Promise<Array<StandingTable>> {
  idSchema.parse(seasonId);

  const response = await sportmonksRequest<Array<SportmonksStandingRaw>>({
    endpoint: `/standings/seasons/${seasonId}`,
    include: ["participant", "details", "rule", "form", "league", "group"],
    cache: "medium",
  });

  // API returns flat array of standings, group them by league for our data model
  return mapStandingsToTables(response.data, seasonId);
}

/**
 * Get all leagues (paginated)
 * Endpoint: GET /leagues
 * Cache: long (6hr) - league list rarely changes
 */
export async function getAllLeagues(page = 1): Promise<{
  leagues: Array<League>;
  hasMore: boolean;
  totalCount: number;
}> {
  const response = await sportmonksPaginatedRequest<SportmonksLeagueRaw>({
    endpoint: "/leagues",
    include: ["country"],
    page,
    perPage: API.sportmonks.defaultPerPage,
    cache: "long",
  });

  return {
    leagues: response.data.map(mapLeague),
    hasMore: response.pagination.has_more,
    totalCount: response.pagination.count,
  };
}

/**
 * Get all leagues (all pages combined)
 * Fetches multiple pages to get complete league list
 * Cache: long (6hr) - league list rarely changes
 */
export async function getAllLeaguesFull(): Promise<Array<League>> {
  const allLeagues: Array<League> = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 10) {
    const result = await getAllLeagues(page);
    allLeagues.push(...result.leagues);
    hasMore = result.hasMore;
    page++;
  }

  return allLeagues;
}

/**
 * Get single league by ID with current season
 * Endpoint: GET /leagues/{leagueId}
 * Cache: long (6hr) - league metadata rarely changes
 */
export async function getLeagueById(leagueId: number): Promise<League> {
  idSchema.parse(leagueId);

  // Sportmonks uses "currentseason" (no camelCase) for the include
  const response =
    await sportmonksRequest<SportmonksLeagueWithCurrentSeasonRaw>({
      endpoint: `/leagues/${leagueId}`,
      include: ["country", "currentseason"],
      cache: "long",
    });

  return mapLeagueWithCurrentSeason(response.data);
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

// Team includes
const TEAM_DETAIL_INCLUDES = [
  "country",
  "venue",
  "coaches.coach",
  "players.player",
  "players.position",
  "activeSeasons.league",
  "trophies.trophy",
  "trophies.league",
  "trophies.season",
];

const TEAM_SEARCH_INCLUDES = ["country"];

/**
 * Get team by ID with full details
 * Endpoint: GET /teams/{id}
 * Cache: medium (1hr) - team info/squad can change
 */
export async function getTeamById(teamId: number): Promise<TeamDetail> {
  idSchema.parse(teamId);

  const response = await sportmonksRequest<SportmonksTeamRaw>({
    endpoint: `/teams/${teamId}`,
    include: TEAM_DETAIL_INCLUDES,
    cache: "medium",
  });

  return mapTeamDetail(response.data);
}

/**
 * Search teams by name
 * Endpoint: GET /teams/search/{name}
 * Cache: medium (1hr) - search results relatively stable
 */
export async function searchTeams(
  query: string,
): Promise<Array<TeamSearchResult>> {
  if (!query || query.length < 2) return [];

  try {
    const response = await sportmonksPaginatedRequest<SportmonksTeamRaw>({
      endpoint: `/teams/search/${encodeURIComponent(query)}`,
      include: TEAM_SEARCH_INCLUDES,
      perPage: 25,
      cache: "medium",
    });

    return response.data.map(mapTeamSearchResult);
  } catch {
    return [];
  }
}

/**
 * Get teams by season ID
 * Endpoint: GET /teams/seasons/{id}
 * Cache: long (6hr) - teams in season rarely change
 */
export async function getTeamsBySeason(
  seasonId: number,
): Promise<Array<TeamSearchResult>> {
  idSchema.parse(seasonId);

  try {
    const response = await sportmonksPaginatedRequest<SportmonksTeamRaw>({
      endpoint: `/teams/seasons/${seasonId}`,
      include: TEAM_SEARCH_INCLUDES,
      perPage: 50,
      cache: "long",
    });

    return response.data.map(mapTeamSearchResult);
  } catch {
    return [];
  }
}

/**
 * Get fixtures by team ID (recent and upcoming)
 * Endpoint: GET /fixtures/between/{startDate}/{endDate}/{teamId}
 * Cache: short (5min) - fixtures can update with scores
 */
export async function getFixturesByTeam(
  teamId: number,
  options: { past?: number; future?: number } = {},
): Promise<{ recent: Array<Fixture>; upcoming: Array<Fixture> }> {
  idSchema.parse(teamId);

  const { past = 5, future = 5 } = options;
  const today = new Date();

  // Calculate date range (past 60 days to future 60 days)
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 60);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 60);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  try {
    const response = await sportmonksPaginatedRequest<SportmonksFixtureRaw>({
      endpoint: `/fixtures/between/${formatDate(startDate)}/${formatDate(endDate)}/${teamId}`,
      include: FIXTURE_INCLUDES,
      perPage: 50,
      cache: "short",
    });

    const fixtures = response.data.map(mapFixture);
    const now = Date.now();

    // Split into past and future
    const pastFixtures = fixtures
      .filter((f) => f.timestamp * 1000 < now)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, past);

    const futureFixtures = fixtures
      .filter((f) => f.timestamp * 1000 >= now)
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, future);

    return {
      recent: pastFixtures,
      upcoming: futureFixtures,
    };
  } catch {
    return { recent: [], upcoming: [] };
  }
}

// Player includes
const PLAYER_DETAIL_INCLUDES = [
  "country",
  "nationality",
  "position",
  "detailedPosition",
  "teams.team",
  // Extended includes for player detail page
  "statistics.details",
  "statistics.season.league",
  "statistics.team",
  "transfers.fromTeam",
  "transfers.toTeam",
  "transfers.type",
  "trophies.trophy",
  "trophies.league",
  "trophies.season",
  // Latest lineups with fixture details
  "latest.fixture.participants",
  "latest.fixture.league",
  "latest.fixture.scores",
  "latest.fixture.state",
  // Metadata (may contain market value)
  "metadata",
];

const PLAYER_SEARCH_INCLUDES = ["country", "position"];

/**
 * Get player by ID with full details
 * Endpoint: GET /players/{id}
 * Cache: long (6hr) - player profile rarely changes
 */
export async function getPlayerById(playerId: number): Promise<PlayerDetail> {
  idSchema.parse(playerId);

  const response = await sportmonksRequest<SportmonksPlayerRaw>({
    endpoint: `/players/${playerId}`,
    include: PLAYER_DETAIL_INCLUDES,
    cache: "long",
  });

  return mapPlayerDetail(response.data);
}

/**
 * Search players by name
 * Endpoint: GET /players/search/{name}
 * Cache: medium (1hr) - search results relatively stable
 */
export async function searchPlayers(
  query: string,
): Promise<Array<PlayerSearchResult>> {
  if (!query || query.length < 2) return [];

  try {
    const response = await sportmonksPaginatedRequest<SportmonksPlayerRaw>({
      endpoint: `/players/search/${encodeURIComponent(query)}`,
      include: PLAYER_SEARCH_INCLUDES,
      perPage: 25,
      cache: "medium",
    });

    return response.data.map(mapPlayerSearchResult);
  } catch {
    return [];
  }
}

/**
 * Top scorer statistic types
 * seasontopscorerTypes filter IDs from Sportmonks API
 */
export type TopScorerStatType =
  | "goals"
  | "assists"
  | "yellowCards"
  | "redCards"
  | "cleanSheets"
  | "rating";

const TOP_SCORER_TYPE_IDS: Record<TopScorerStatType, number> = {
  goals: 208,
  assists: 209,
  yellowCards: 210,
  redCards: 211,
  cleanSheets: 212,
  rating: 118,
};

// Key player stat types for betting insights
export const KEY_PLAYER_STAT_TYPES = ["goals", "assists", "rating"] as const;
export type KeyPlayerStatType = (typeof KEY_PLAYER_STAT_TYPES)[number];

/**
 * Get key players by season (goals, assists, ratings)
 * Fetches all three in parallel for key player detection
 * Returns combined structure for cross-referencing with sidelined players
 */
export async function getKeyPlayersBySeason(
  seasonId: number,
  limit = 20,
): Promise<{
  scorers: Array<TopScorer>;
  assists: Array<TopScorer>;
  rated: Array<TopScorer>;
}> {
  const [scorers, assists, rated] = await Promise.all([
    getTopScorersBySeason(seasonId, "goals", limit).catch(() => []),
    getTopScorersBySeason(seasonId, "assists", limit).catch(() => []),
    getTopScorersBySeason(seasonId, "rating", limit).catch(() => []),
  ]);

  return { scorers, assists, rated };
}

/**
 * Get top scorers by season
 * Endpoint: GET /topscorers/seasons/{seasonId}
 * Supports: goals, assists, yellowCards, redCards, cleanSheets, rating
 * Cache: short (5min) - updates after goals scored
 */
export async function getTopScorersBySeason(
  seasonId: number,
  type: TopScorerStatType = "goals",
  limit = 10,
): Promise<Array<TopScorer>> {
  idSchema.parse(seasonId);

  const filterTypeId = TOP_SCORER_TYPE_IDS[type];

  try {
    const response = await sportmonksPaginatedRequest<SportmonksTopScorerRaw>({
      endpoint: `/topscorers/seasons/${seasonId}`,
      include: ["player", "player.nationality", "participant", "type"],
      perPage: limit,
      filters: { seasontopscorerTypes: filterTypeId },
      cache: "short",
    });

    return response.data.map(mapTopScorer);
  } catch {
    return [];
  }
}

/**
 * Get fixtures by season with date range
 * Endpoint: GET /fixtures/between/{startDate}/{endDate}
 * Filtered by league
 * Cache: short (5min) - fixtures can update with scores
 */
export async function getFixturesBySeason(
  leagueId: number,
  options: { past?: number; future?: number } = {},
): Promise<{ recent: Array<Fixture>; upcoming: Array<Fixture> }> {
  idSchema.parse(leagueId);

  const { past = 10, future = 10 } = options;
  const today = new Date();

  // Calculate date range (past 30 days to future 30 days)
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 30);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 30);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  try {
    const response = await sportmonksPaginatedRequest<SportmonksFixtureRaw>({
      endpoint: `/fixtures/between/${formatDate(startDate)}/${formatDate(endDate)}`,
      include: FIXTURE_INCLUDES,
      perPage: 50,
      filters: { fixtureLeagues: leagueId },
      cache: "short",
    });

    const fixtures = response.data.map(mapFixture);
    const now = Date.now();

    // Split into past and future
    const pastFixtures = fixtures
      .filter((f) => f.timestamp * 1000 < now && f.status === "finished")
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, past);

    const futureFixtures = fixtures
      .filter((f) => f.timestamp * 1000 >= now || f.status === "scheduled")
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, future);

    return {
      recent: pastFixtures,
      upcoming: futureFixtures,
    };
  } catch {
    return { recent: [], upcoming: [] };
  }
}

/**
 * Get live fixtures for a specific league
 * Uses API filter instead of fetching all live fixtures
 * Cache: live (30s) - real-time score data
 */
export async function getLiveFixturesByLeague(
  leagueId: number,
): Promise<Array<Fixture>> {
  idSchema.parse(leagueId);

  try {
    const response = await sportmonksRequest<Array<SportmonksFixtureRaw>>({
      endpoint: "/livescores/inplay",
      include: FIXTURE_INCLUDES,
      filters: { fixtureLeagues: leagueId },
      cache: "live",
    });

    return response.data.map(mapFixture);
  } catch {
    return [];
  }
}

/**
 * Get comprehensive league page data
 * Fetches all data needed for a rich league page in parallel
 */
export async function getLeaguePageData(
  leagueId: number,
): Promise<LeaguePageData> {
  idSchema.parse(leagueId);

  // First get the league to know the current season
  const league = await getLeagueById(leagueId);

  if (!league.currentSeasonId) {
    return {
      league,
      standings: [],
      topScorers: [],
      topAssists: [],
      recentFixtures: [],
      upcomingFixtures: [],
      liveFixtures: [],
    };
  }

  // Fetch all data in parallel
  const [standings, topScorers, topAssists, fixtures, liveFixtures] =
    await Promise.all([
      getStandingsBySeason(league.currentSeasonId).catch(() => []),
      getTopScorersBySeason(league.currentSeasonId, "goals", 10).catch(
        () => [],
      ),
      getTopScorersBySeason(league.currentSeasonId, "assists", 10).catch(
        () => [],
      ),
      getFixturesBySeason(leagueId, { past: 10, future: 20 }).catch(() => ({
        recent: [],
        upcoming: [],
      })),
      getLiveFixturesByLeague(leagueId).catch(() => []),
    ]);

  // Enrich standings with next match info from upcoming fixtures
  const enrichedStandings = standings.map((table) => ({
    ...table,
    standings: table.standings.map((standing) => {
      // Find first upcoming fixture for this team
      const nextFixture = fixtures.upcoming.find(
        (f) =>
          f.homeTeam.id === standing.teamId ||
          f.awayTeam.id === standing.teamId,
      );

      if (nextFixture) {
        const isHome = nextFixture.homeTeam.id === standing.teamId;
        const opponent = isHome ? nextFixture.awayTeam : nextFixture.homeTeam;

        return {
          ...standing,
          nextMatch: {
            teamId: opponent.id,
            teamName: opponent.name,
            teamLogo: opponent.logo,
            isHome,
            matchDate: nextFixture.startTime,
          },
        };
      }

      return standing;
    }),
  }));

  return {
    league,
    standings: enrichedStandings,
    topScorers,
    topAssists,
    recentFixtures: fixtures.recent,
    upcomingFixtures: fixtures.upcoming,
    liveFixtures,
  };
}

/**
 * League stats page data
 */
export interface LeagueStatsData {
  league: League;
  standings: Standing[];
  recentFixtures: Fixture[];
  goals: TopScorer[];
  assists: TopScorer[];
  yellowCards: TopScorer[];
  redCards: TopScorer[];
  cleanSheets: TopScorer[];
  ratings: TopScorer[];
}

/**
 * Get all statistics for league stats page
 * Fetches top scorers for all stat types in parallel
 */
export async function getLeagueStatsData(
  leagueId: number,
): Promise<LeagueStatsData> {
  const league = await getLeagueById(leagueId);

  if (!league.currentSeasonId) {
    return {
      league,
      standings: [],
      recentFixtures: [],
      goals: [],
      assists: [],
      yellowCards: [],
      redCards: [],
      cleanSheets: [],
      ratings: [],
    };
  }

  const seasonId = league.currentSeasonId;

  const [
    standingsData,
    fixtures,
    goals,
    assists,
    yellowCards,
    redCards,
    cleanSheets,
    ratings,
  ] = await Promise.all([
    getStandingsBySeason(seasonId).catch(() => []),
    getFixturesBySeason(leagueId, { past: 10 }).catch(() => ({
      recent: [],
      upcoming: [],
    })),
    getTopScorersBySeason(seasonId, "goals", 10),
    getTopScorersBySeason(seasonId, "assists", 10),
    getTopScorersBySeason(seasonId, "yellowCards", 10),
    getTopScorersBySeason(seasonId, "redCards", 10),
    getTopScorersBySeason(seasonId, "cleanSheets", 10),
    getTopScorersBySeason(seasonId, "rating", 10),
  ]);

  const standings =
    standingsData.length > 0 && standingsData[0].standings.length > 0
      ? standingsData[0].standings
      : [];

  return {
    league,
    standings,
    recentFixtures: fixtures.recent,
    goals,
    assists,
    yellowCards,
    redCards,
    cleanSheets,
    ratings,
  };
}

/**
 * Get transfers for a team
 * Fetches both incoming and outgoing transfers
 */
export async function getTeamTransfers(
  teamId: number,
  options: {
    perPage?: number;
    page?: number;
  } = {},
): Promise<{
  transfers: TeamTransfer[];
  arrivals: TeamTransfer[];
  departures: TeamTransfer[];
  hasMore: boolean;
}> {
  idSchema.parse(teamId);

  const { perPage = 50, page = 1 } = options;

  const response = await sportmonksRequest<SportmonksTransferRaw[]>({
    endpoint: `/transfers/teams/${teamId}`,
    include: ["player", "fromTeam", "toTeam", "type"],
    perPage,
    page,
    order: "desc",
  });

  const transfers = (response.data || []).map((raw) =>
    mapTeamTransfer(raw, teamId),
  );

  // Sort by date (newest first)
  transfers.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Separate arrivals and departures
  const arrivals = transfers.filter((t) => t.direction === "in");
  const departures = transfers.filter((t) => t.direction === "out");

  // Check if response has pagination info (cast to any for optional field access)
  const paginatedResponse = response as {
    pagination?: { has_more?: boolean };
  };

  return {
    transfers,
    arrivals,
    departures,
    hasMore: paginatedResponse.pagination?.has_more ?? false,
  };
}

// ============================================
// COACH API FUNCTIONS
// ============================================

// Coach includes
const COACH_DETAIL_INCLUDES = [
  "country",
  "nationality",
  "teams.team",
  "teams.team.country",
  "trophies.trophy",
  "trophies.league",
  "trophies.season",
];

const COACH_SEARCH_INCLUDES = ["country"];

/**
 * Get coach by ID with full details
 * Endpoint: GET /coaches/{id}
 * Cache: long (6hr) - coach profile rarely changes
 */
export async function getCoachById(coachId: number): Promise<CoachDetail> {
  idSchema.parse(coachId);

  const response = await sportmonksRequest<SportmonksCoachDetailRaw>({
    endpoint: `/coaches/${coachId}`,
    include: COACH_DETAIL_INCLUDES,
    cache: "long",
  });

  return mapCoachDetail(response.data);
}

/**
 * Search coaches by name
 * Endpoint: GET /coaches/search/{name}
 * Cache: medium (1hr) - search results relatively stable
 */
export async function searchCoaches(
  query: string,
): Promise<Array<CoachSearchResult>> {
  if (!query || query.length < 2) return [];

  try {
    const response = await sportmonksPaginatedRequest<SportmonksCoachRaw>({
      endpoint: `/coaches/search/${encodeURIComponent(query)}`,
      include: COACH_SEARCH_INCLUDES,
      perPage: 25,
      cache: "medium",
    });

    return response.data.map((raw) => mapCoachSearchResult(raw));
  } catch {
    return [];
  }
}
