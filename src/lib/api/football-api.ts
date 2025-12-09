import { z } from "zod";
import { sportmonksRequest, sportmonksPaginatedRequest } from "./sportmonks-client";
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
} from "./sportmonks-mappers";
import type {
  SportmonksFixtureRaw,
  SportmonksLeagueRaw,
  SportmonksLeagueWithCurrentSeasonRaw,
  SportmonksStandingRaw,
  SportmonksOddRaw,
  SportmonksTeamRaw,
  SportmonksPlayerRaw,
} from "@/types/sportmonks/raw";
import type { Fixture, FixtureDetail, League, StandingTable, H2HFixture, MatchOdds, TeamDetail, TeamSearchResult, PlayerDetail, PlayerSearchResult } from "@/types/football";
import { API, UI } from "@/lib/constants";

// Validation schemas
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format");
const idSchema = z.number().int().positive();

// Default includes for fixtures
const FIXTURE_INCLUDES = ["participants", "scores", "state", "league", "periods"];
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
];

// H2H includes
const H2H_INCLUDES = ["participants", "scores", "state", "league"];

/**
 * Get live (in-play) fixtures
 * Endpoint: GET /livescores/inplay
 * Note: This endpoint does not support pagination
 */
export async function getLiveFixtures(): Promise<Array<Fixture>> {
  const response = await sportmonksRequest<Array<SportmonksFixtureRaw>>({
    endpoint: "/livescores/inplay",
    include: FIXTURE_INCLUDES,
  });

  const fixtures = response.data.map(mapFixture);
  return fixtures.slice(0, UI.fixtures.maxLiveFixtures);
}

/**
 * Get fixtures by date (max fixtures for homepage)
 * Endpoint: GET /fixtures/date/{date}
 */
export async function getFixturesByDate(date?: string): Promise<Array<Fixture>> {
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
 */
export async function getFixtureById(fixtureId: number): Promise<FixtureDetail> {
  idSchema.parse(fixtureId);

  const response = await sportmonksRequest<SportmonksFixtureRaw>({
    endpoint: `/fixtures/${fixtureId}`,
    include: FIXTURE_DETAIL_INCLUDES,
  });

  return mapFixtureDetail(response.data);
}

/**
 * Get head-to-head fixtures between two teams
 * Endpoint: GET /fixtures/head-to-head/{homeId}/{awayId}
 */
export async function getHeadToHead(homeId: number, awayId: number): Promise<Array<H2HFixture>> {
  idSchema.parse(homeId);
  idSchema.parse(awayId);

  try {
    const response = await sportmonksPaginatedRequest<SportmonksFixtureRaw>({
      endpoint: `/fixtures/head-to-head/${homeId}/${awayId}`,
      include: H2H_INCLUDES,
      perPage: 10,
    });

    return response.data.map(mapH2HFixture);
  } catch {
    return [];
  }
}

/**
 * Get pre-match odds for a fixture
 * Endpoint: GET /odds/pre-match/fixtures/{fixtureId}
 */
export async function getOddsByFixture(fixtureId: number): Promise<MatchOdds | null> {
  idSchema.parse(fixtureId);

  try {
    const response = await sportmonksPaginatedRequest<SportmonksOddRaw>({
      endpoint: `/odds/pre-match/fixtures/${fixtureId}`,
      include: ["bookmaker"],
      perPage: 50,
    });

    return mapMatchOdds(response.data);
  } catch {
    return null;
  }
}

/**
 * Get standings by season
 * Endpoint: GET /standings/seasons/{seasonId}
 * Returns flat array of standing entries, not grouped
 */
export async function getStandingsBySeason(seasonId: number): Promise<Array<StandingTable>> {
  idSchema.parse(seasonId);

  const response = await sportmonksRequest<Array<SportmonksStandingRaw>>({
    endpoint: `/standings/seasons/${seasonId}`,
    include: ["participant", "details", "rule"],
  });

  // API returns flat array of standings, group them by league for our data model
  return mapStandingsToTables(response.data, seasonId);
}

/**
 * Get all leagues (paginated)
 * Endpoint: GET /leagues
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
  });

  return {
    leagues: response.data.map(mapLeague),
    hasMore: response.pagination.has_more,
    totalCount: response.pagination.count,
  };
}

/**
 * Get single league by ID with current season
 * Endpoint: GET /leagues/{leagueId}
 */
export async function getLeagueById(leagueId: number): Promise<League> {
  idSchema.parse(leagueId);

  // Sportmonks uses "currentseason" (no camelCase) for the include
  const response = await sportmonksRequest<SportmonksLeagueWithCurrentSeasonRaw>({
    endpoint: `/leagues/${leagueId}`,
    include: ["country", "currentseason"],
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
];

const TEAM_SEARCH_INCLUDES = ["country"];

/**
 * Get team by ID with full details
 * Endpoint: GET /teams/{id}
 */
export async function getTeamById(teamId: number): Promise<TeamDetail> {
  idSchema.parse(teamId);

  const response = await sportmonksRequest<SportmonksTeamRaw>({
    endpoint: `/teams/${teamId}`,
    include: TEAM_DETAIL_INCLUDES,
  });

  return mapTeamDetail(response.data);
}

/**
 * Search teams by name
 * Endpoint: GET /teams/search/{name}
 */
export async function searchTeams(query: string): Promise<Array<TeamSearchResult>> {
  if (!query || query.length < 2) return [];

  try {
    const response = await sportmonksPaginatedRequest<SportmonksTeamRaw>({
      endpoint: `/teams/search/${encodeURIComponent(query)}`,
      include: TEAM_SEARCH_INCLUDES,
      perPage: 25,
    });

    return response.data.map(mapTeamSearchResult);
  } catch {
    return [];
  }
}

/**
 * Get fixtures by team ID (recent and upcoming)
 * Endpoint: GET /fixtures/between/{startDate}/{endDate}/{teamId}
 */
export async function getFixturesByTeam(
  teamId: number,
  options: { past?: number; future?: number } = {}
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
];

const PLAYER_SEARCH_INCLUDES = ["country", "position"];

/**
 * Get player by ID with full details
 * Endpoint: GET /players/{id}
 */
export async function getPlayerById(playerId: number): Promise<PlayerDetail> {
  idSchema.parse(playerId);

  const response = await sportmonksRequest<SportmonksPlayerRaw>({
    endpoint: `/players/${playerId}`,
    include: PLAYER_DETAIL_INCLUDES,
  });

  return mapPlayerDetail(response.data);
}

/**
 * Search players by name
 * Endpoint: GET /players/search/{name}
 */
export async function searchPlayers(query: string): Promise<Array<PlayerSearchResult>> {
  if (!query || query.length < 2) return [];

  try {
    const response = await sportmonksPaginatedRequest<SportmonksPlayerRaw>({
      endpoint: `/players/search/${encodeURIComponent(query)}`,
      include: PLAYER_SEARCH_INCLUDES,
      perPage: 25,
    });

    return response.data.map(mapPlayerSearchResult);
  } catch {
    return [];
  }
}
