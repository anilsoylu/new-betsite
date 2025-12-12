/**
 * Query Functions for Sitemap Generation
 *
 * These functions retrieve data from the SQLite cache for sitemap XML generation.
 * All queries filter by include_in_sitemap = 1 and use pagination.
 */

import { getDatabase } from "./connection";
import { SITEMAP_CONFIG } from "./config";
import type { MatchSitemapEntry, SitemapEntry } from "./types";

// ============================================================================
// Count Functions
// ============================================================================

/**
 * Get the total count of leagues included in sitemap.
 */
export function getLeagueCount(): number {
  const db = getDatabase();
  const result = db
    .prepare(
      "SELECT COUNT(*) as count FROM leagues WHERE include_in_sitemap = 1",
    )
    .get() as { count: number };
  return result.count;
}

/**
 * Get the total count of teams included in sitemap.
 */
export function getTeamCount(): number {
  const db = getDatabase();
  const result = db
    .prepare("SELECT COUNT(*) as count FROM teams WHERE include_in_sitemap = 1")
    .get() as { count: number };
  return result.count;
}

/**
 * Get the total count of players included in sitemap.
 */
export function getPlayerCount(): number {
  const db = getDatabase();
  const result = db
    .prepare(
      "SELECT COUNT(*) as count FROM players WHERE include_in_sitemap = 1",
    )
    .get() as { count: number };
  return result.count;
}

/**
 * Get the total count of coaches included in sitemap.
 */
export function getCoachCount(): number {
  const db = getDatabase();
  const result = db
    .prepare(
      "SELECT COUNT(*) as count FROM coaches WHERE include_in_sitemap = 1",
    )
    .get() as { count: number };
  return result.count;
}

/**
 * Get the total count of matches included in sitemap (within date window).
 */
export function getMatchCount(): number {
  const db = getDatabase();
  const { past, future } = SITEMAP_CONFIG.MATCH_WINDOW_DAYS;

  const result = db
    .prepare(
      `
      SELECT COUNT(*) as count FROM matches
      WHERE include_in_sitemap = 1
      AND kickoff_at BETWEEN datetime('now', ?) AND datetime('now', ?)
    `,
    )
    .get(`-${past} days`, `+${future} days`) as { count: number };

  return result.count;
}

/**
 * Get the total count of ALL matches in cache (regardless of date window).
 * Useful for monitoring total cache size.
 */
export function getTotalMatchCount(): number {
  const db = getDatabase();
  const result = db
    .prepare(
      "SELECT COUNT(*) as count FROM matches WHERE include_in_sitemap = 1",
    )
    .get() as { count: number };
  return result.count;
}

// ============================================================================
// Paginated Query Functions
// ============================================================================

/**
 * Get paginated league entries for sitemap generation.
 * @param page - 1-based page number
 */
export function getLeaguesForSitemap(page: number): SitemapEntry[] {
  const db = getDatabase();
  const pageSize = SITEMAP_CONFIG.PAGE_SIZE.leagues;
  const offset = (page - 1) * pageSize;

  return db
    .prepare(
      `
      SELECT
        id,
        name,
        slug,
        COALESCE(last_modified, updated_at) as lastModified
      FROM leagues
      WHERE include_in_sitemap = 1
      ORDER BY id
      LIMIT ? OFFSET ?
    `,
    )
    .all(pageSize, offset) as SitemapEntry[];
}

/**
 * Get paginated team entries for sitemap generation.
 * @param page - 1-based page number
 */
export function getTeamsForSitemap(page: number): SitemapEntry[] {
  const db = getDatabase();
  const pageSize = SITEMAP_CONFIG.PAGE_SIZE.teams;
  const offset = (page - 1) * pageSize;

  return db
    .prepare(
      `
      SELECT
        id,
        name,
        slug,
        COALESCE(last_modified, updated_at) as lastModified
      FROM teams
      WHERE include_in_sitemap = 1
      ORDER BY id
      LIMIT ? OFFSET ?
    `,
    )
    .all(pageSize, offset) as SitemapEntry[];
}

/**
 * Get paginated player entries for sitemap generation.
 * @param page - 1-based page number
 */
export function getPlayersForSitemap(page: number): SitemapEntry[] {
  const db = getDatabase();
  const pageSize = SITEMAP_CONFIG.PAGE_SIZE.players;
  const offset = (page - 1) * pageSize;

  return db
    .prepare(
      `
      SELECT
        id,
        name,
        slug,
        COALESCE(last_modified, updated_at) as lastModified
      FROM players
      WHERE include_in_sitemap = 1
      ORDER BY id
      LIMIT ? OFFSET ?
    `,
    )
    .all(pageSize, offset) as SitemapEntry[];
}

/**
 * Get paginated coach entries for sitemap generation.
 * @param page - 1-based page number
 */
export function getCoachesForSitemap(page: number): SitemapEntry[] {
  const db = getDatabase();
  const pageSize = SITEMAP_CONFIG.PAGE_SIZE.coaches;
  const offset = (page - 1) * pageSize;

  return db
    .prepare(
      `
      SELECT
        id,
        name,
        slug,
        COALESCE(last_modified, updated_at) as lastModified
      FROM coaches
      WHERE include_in_sitemap = 1
      ORDER BY id
      LIMIT ? OFFSET ?
    `,
    )
    .all(pageSize, offset) as SitemapEntry[];
}

/**
 * Get paginated match entries for sitemap generation.
 * Only includes matches within the configured date window.
 * @param page - 1-based page number
 */
export function getMatchesForSitemap(page: number): MatchSitemapEntry[] {
  const db = getDatabase();
  const pageSize = SITEMAP_CONFIG.PAGE_SIZE.matches;
  const offset = (page - 1) * pageSize;
  const { past, future } = SITEMAP_CONFIG.MATCH_WINDOW_DAYS;

  return db
    .prepare(
      `
      SELECT
        id,
        home_team_name as homeTeamName,
        away_team_name as awayTeamName,
        slug,
        kickoff_at as kickoffAt,
        COALESCE(last_modified, updated_at) as lastModified
      FROM matches
      WHERE include_in_sitemap = 1
      AND kickoff_at BETWEEN datetime('now', ?) AND datetime('now', ?)
      ORDER BY kickoff_at DESC, id
      LIMIT ? OFFSET ?
    `,
    )
    .all(
      `-${past} days`,
      `+${future} days`,
      pageSize,
      offset,
    ) as MatchSitemapEntry[];
}

// ============================================================================
// Page Count Helpers
// ============================================================================

/**
 * Calculate the number of sitemap pages needed for leagues.
 */
export function getLeaguePageCount(): number {
  const total = getLeagueCount();
  return Math.max(1, Math.ceil(total / SITEMAP_CONFIG.PAGE_SIZE.leagues));
}

/**
 * Calculate the number of sitemap pages needed for teams.
 */
export function getTeamPageCount(): number {
  const total = getTeamCount();
  return Math.max(1, Math.ceil(total / SITEMAP_CONFIG.PAGE_SIZE.teams));
}

/**
 * Calculate the number of sitemap pages needed for players.
 */
export function getPlayerPageCount(): number {
  const total = getPlayerCount();
  return Math.max(1, Math.ceil(total / SITEMAP_CONFIG.PAGE_SIZE.players));
}

/**
 * Calculate the number of sitemap pages needed for coaches.
 */
export function getCoachPageCount(): number {
  const total = getCoachCount();
  return Math.max(1, Math.ceil(total / SITEMAP_CONFIG.PAGE_SIZE.coaches));
}

/**
 * Calculate the number of sitemap pages needed for matches.
 */
export function getMatchPageCount(): number {
  const total = getMatchCount();
  return Math.max(1, Math.ceil(total / SITEMAP_CONFIG.PAGE_SIZE.matches));
}

// ============================================================================
// Faz 4: Coaches Page Queries - SQLite-first approach
// ============================================================================

/**
 * Coach with team info for display purposes
 */
export interface CoachWithTeam {
  id: number;
  name: string;
  slug: string;
  teamId: number | null;
  teamName: string | null;
  teamLogo: string | null;
  country: string | null;
}

/**
 * League with coaches data structure
 */
export interface LeagueWithCoaches {
  leagueId: number;
  leagueName: string;
  leagueLogo: string | null;
  coaches: CoachWithTeam[];
}

/**
 * Get coaches with their current team info.
 * Joins coaches table with teams table for display.
 * @param limit - Maximum coaches to return (default 100)
 */
export function getCoachesWithTeams(limit = 100): CoachWithTeam[] {
  const db = getDatabase();

  return db
    .prepare(
      `
      SELECT
        c.id,
        c.name,
        c.slug,
        c.team_id as teamId,
        t.name as teamName,
        t.logo as teamLogo,
        c.country
      FROM coaches c
      LEFT JOIN teams t ON c.team_id = t.id
      WHERE c.include_in_sitemap = 1
      AND c.team_id IS NOT NULL
      ORDER BY c.name
      LIMIT ?
    `,
    )
    .all(limit) as CoachWithTeam[];
}

/**
 * Get coaches grouped by league (via team's league_id).
 * For the coaches page which displays coaches by league.
 * Returns a Map for efficient lookup and iteration.
 */
export function getCoachesByLeague(): Map<number, LeagueWithCoaches> {
  const db = getDatabase();

  const rows = db
    .prepare(
      `
      SELECT
        c.id,
        c.name,
        c.slug,
        c.team_id as teamId,
        t.name as teamName,
        t.logo as teamLogo,
        c.country,
        t.league_id as leagueId,
        l.name as leagueName,
        l.logo as leagueLogo
      FROM coaches c
      INNER JOIN teams t ON c.team_id = t.id
      INNER JOIN leagues l ON t.league_id = l.id
      WHERE c.include_in_sitemap = 1
      AND c.team_id IS NOT NULL
      AND t.league_id IS NOT NULL
      ORDER BY l.name, c.name
    `,
    )
    .all() as Array<
    CoachWithTeam & { leagueId: number; leagueName: string; leagueLogo: string }
  >;

  const byLeague = new Map<number, LeagueWithCoaches>();

  for (const row of rows) {
    let league = byLeague.get(row.leagueId);
    if (!league) {
      league = {
        leagueId: row.leagueId,
        leagueName: row.leagueName,
        leagueLogo: row.leagueLogo,
        coaches: [],
      };
      byLeague.set(row.leagueId, league);
    }
    league.coaches.push({
      id: row.id,
      name: row.name,
      slug: row.slug,
      teamId: row.teamId,
      teamName: row.teamName,
      teamLogo: row.teamLogo,
      country: row.country,
    });
  }

  return byLeague;
}

/**
 * Get popular leagues with their coaches for the coaches page.
 * @param popularLeagueIds - Array of league IDs to filter by
 * @param maxCoachesPerLeague - Maximum coaches per league
 */
export function getCoachesForPopularLeagues(
  popularLeagueIds: number[],
  maxCoachesPerLeague = 16,
): LeagueWithCoaches[] {
  if (popularLeagueIds.length === 0) return [];

  const db = getDatabase();
  const placeholders = popularLeagueIds.map(() => "?").join(",");

  const rows = db
    .prepare(
      `
      SELECT
        c.id,
        c.name,
        c.slug,
        c.team_id as teamId,
        t.name as teamName,
        t.logo as teamLogo,
        c.country,
        t.league_id as leagueId,
        l.name as leagueName,
        l.logo as leagueLogo
      FROM coaches c
      INNER JOIN teams t ON c.team_id = t.id
      INNER JOIN leagues l ON t.league_id = l.id
      WHERE c.include_in_sitemap = 1
      AND c.team_id IS NOT NULL
      AND t.league_id IN (${placeholders})
      ORDER BY l.name, c.name
    `,
    )
    .all(...popularLeagueIds) as Array<
    CoachWithTeam & { leagueId: number; leagueName: string; leagueLogo: string }
  >;

  // Group by league and limit coaches
  const byLeague = new Map<number, LeagueWithCoaches>();

  for (const row of rows) {
    let league = byLeague.get(row.leagueId);
    if (!league) {
      league = {
        leagueId: row.leagueId,
        leagueName: row.leagueName,
        leagueLogo: row.leagueLogo,
        coaches: [],
      };
      byLeague.set(row.leagueId, league);
    }
    // Limit coaches per league
    if (league.coaches.length < maxCoachesPerLeague) {
      league.coaches.push({
        id: row.id,
        name: row.name,
        slug: row.slug,
        teamId: row.teamId,
        teamName: row.teamName,
        teamLogo: row.teamLogo,
        country: row.country,
      });
    }
  }

  // Return in the order of popularLeagueIds
  return popularLeagueIds
    .map((id) => byLeague.get(id))
    .filter((league): league is LeagueWithCoaches => league !== undefined);
}
