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
        name,
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
 * Calculate the number of sitemap pages needed for matches.
 */
export function getMatchPageCount(): number {
  const total = getMatchCount();
  return Math.max(1, Math.ceil(total / SITEMAP_CONFIG.PAGE_SIZE.matches));
}
