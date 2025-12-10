/**
 * Cached Football API
 *
 * This module wraps the original football-api.ts functions with automatic
 * sitemap cache population. Import from this module instead of football-api.ts
 * in page components to enable cache population.
 *
 * Cache updates are fire-and-forget - they don't block page rendering.
 */

import {
  cacheFixture,
  cacheFixtures,
  cacheLeague,
  cacheLeagues,
  cachePlayerDetail,
  cacheTeamDetail,
  cacheTeamSearchResult,
  initializeSchema,
} from "@/lib/sitemap-cache";

// Re-export everything from football-api first
export * from "./football-api";

// Import the original functions we want to wrap
import {
  getAllLeagues as _getAllLeagues,
  getFixtureById as _getFixtureById,
  getFixturesByDate as _getFixturesByDate,
  getFixturesByTeam as _getFixturesByTeam,
  getLeagueById as _getLeagueById,
  getLeaguePageData as _getLeaguePageData,
  getLiveFixtures as _getLiveFixtures,
  getPlayerById as _getPlayerById,
  getTeamById as _getTeamById,
  searchPlayers as _searchPlayers,
  searchTeams as _searchTeams,
} from "./football-api";

import type {
  Fixture,
  FixtureDetail,
  League,
  LeaguePageData,
  PlayerDetail,
  PlayerSearchResult,
  TeamDetail,
  TeamSearchResult,
} from "@/types/football";

// Initialize schema on module load (safe to call multiple times)
let schemaInitialized = false;
function ensureSchema() {
  if (!schemaInitialized) {
    try {
      initializeSchema();
      schemaInitialized = true;
    } catch (error) {
      console.warn("[CachedAPI] Failed to initialize schema:", error);
    }
  }
}

/**
 * Get live fixtures with cache population.
 */
export async function getLiveFixtures(): Promise<Array<Fixture>> {
  const fixtures = await _getLiveFixtures();

  // Cache in background
  ensureSchema();
  cacheFixtures(fixtures);

  return fixtures;
}

/**
 * Get fixtures by date with cache population.
 */
export async function getFixturesByDate(date: string): Promise<Array<Fixture>> {
  const fixtures = await _getFixturesByDate(date);

  // Cache in background
  ensureSchema();
  cacheFixtures(fixtures);

  return fixtures;
}

/**
 * Get single fixture by ID with cache population.
 */
export async function getFixtureById(
  fixtureId: number,
): Promise<FixtureDetail> {
  const fixture = await _getFixtureById(fixtureId);

  // Cache in background
  ensureSchema();
  cacheFixture(fixture);

  return fixture;
}

/**
 * Get all leagues with cache population.
 */
export async function getAllLeagues(
  page = 1,
): Promise<{ leagues: League[]; hasMore: boolean }> {
  const result = await _getAllLeagues(page);

  // Cache in background
  ensureSchema();
  cacheLeagues(result.leagues);

  return result;
}

/**
 * Get league by ID with cache population.
 */
export async function getLeagueById(leagueId: number): Promise<League> {
  const league = await _getLeagueById(leagueId);

  // Cache in background
  ensureSchema();
  cacheLeague(league);

  return league;
}

/**
 * Get team by ID with cache population (includes squad players).
 */
export async function getTeamById(teamId: number): Promise<TeamDetail> {
  const team = await _getTeamById(teamId);

  // Cache team and all squad players in background
  ensureSchema();
  cacheTeamDetail(team);

  return team;
}

/**
 * Search teams with cache population.
 */
export async function searchTeams(
  query: string,
): Promise<Array<TeamSearchResult>> {
  const teams = await _searchTeams(query);

  // Cache in background
  ensureSchema();
  for (const team of teams) {
    cacheTeamSearchResult(team);
  }

  return teams;
}

/**
 * Get fixtures by team with cache population.
 */
export async function getFixturesByTeam(
  teamId: number,
  options?: { past?: number; future?: number },
): Promise<{ recent: Fixture[]; upcoming: Fixture[] }> {
  const result = await _getFixturesByTeam(teamId, options);

  // Cache all fixtures in background
  ensureSchema();
  cacheFixtures([...result.recent, ...result.upcoming]);

  return result;
}

/**
 * Get player by ID with cache population.
 */
export async function getPlayerById(playerId: number): Promise<PlayerDetail> {
  const player = await _getPlayerById(playerId);

  // Cache in background
  ensureSchema();
  cachePlayerDetail(player);

  return player;
}

/**
 * Search players with cache population.
 */
export async function searchPlayers(
  query: string,
): Promise<Array<PlayerSearchResult>> {
  const players = await _searchPlayers(query);

  // Cache basic player info in background
  // Note: PlayerSearchResult has less info than PlayerDetail
  ensureSchema();
  for (const player of players) {
    try {
      // Only cache if we have the necessary fields
      if (player.id && player.name) {
        // Using direct upsert since PlayerSearchResult doesn't match PlayerDetail
        const { upsertPlayer } = await import("@/lib/sitemap-cache");
        upsertPlayer({
          id: player.id,
          name: player.displayName || player.name,
          country: player.country?.name ?? null,
          position: player.position ?? null,
        });
      }
    } catch (error) {
      console.warn("[CachedAPI] Failed to cache player search result:", error);
    }
  }

  return players;
}

/**
 * Get league page data with cache population.
 * This is a rich endpoint that returns standings, fixtures, and top scorers.
 */
export async function getLeaguePageData(
  leagueId: number,
): Promise<LeaguePageData> {
  const data = await _getLeaguePageData(leagueId);

  // Cache in background
  ensureSchema();

  // Cache the league itself
  if (data.league) {
    cacheLeague(data.league);
  }

  // Cache all fixtures
  cacheFixtures([
    ...data.liveFixtures,
    ...data.upcomingFixtures,
    ...data.recentFixtures,
  ]);

  // Cache teams from standings
  for (const table of data.standings) {
    for (const standing of table.standings) {
      try {
        const { upsertTeam } = await import("@/lib/sitemap-cache");
        upsertTeam({
          id: standing.teamId,
          name: standing.teamName,
          leagueId: table.leagueId,
          logo: standing.teamLogo,
        });
      } catch (error) {
        // Ignore individual cache failures
      }
    }
  }

  return data;
}
