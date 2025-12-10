/**
 * Database Schema Definitions and Initialization
 *
 * Defines table structures for the sitemap cache.
 * Tables use soft-delete pattern via include_in_sitemap flag.
 */

import { getDatabase } from "./connection";

/**
 * Initialize the database schema.
 * Creates all tables and indexes if they don't exist.
 * Safe to call multiple times (uses IF NOT EXISTS).
 */
export function initializeSchema(): void {
  const db = getDatabase();

  // Leagues table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS leagues (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      country TEXT,
      logo TEXT,
      last_modified TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      include_in_sitemap INTEGER NOT NULL DEFAULT 1
    )
  `).run();

  db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_leagues_sitemap
    ON leagues(include_in_sitemap)
    WHERE include_in_sitemap = 1
  `).run();

  // Teams table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      league_id INTEGER,
      country TEXT,
      logo TEXT,
      last_modified TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      include_in_sitemap INTEGER NOT NULL DEFAULT 1
    )
  `).run();

  db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_teams_sitemap
    ON teams(include_in_sitemap)
    WHERE include_in_sitemap = 1
  `).run();

  db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_teams_league
    ON teams(league_id)
  `).run();

  // Players table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      team_id INTEGER,
      country TEXT,
      position TEXT,
      last_modified TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      include_in_sitemap INTEGER NOT NULL DEFAULT 1
    )
  `).run();

  db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_players_sitemap
    ON players(include_in_sitemap)
    WHERE include_in_sitemap = 1
  `).run();

  db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_players_team
    ON players(team_id)
  `).run();

  // Matches table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY,
      home_team_name TEXT NOT NULL,
      away_team_name TEXT NOT NULL,
      slug TEXT NOT NULL,
      kickoff_at TEXT NOT NULL,
      league_id INTEGER,
      league_name TEXT,
      last_modified TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      include_in_sitemap INTEGER NOT NULL DEFAULT 1
    )
  `).run();

  db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_matches_sitemap
    ON matches(include_in_sitemap, kickoff_at)
    WHERE include_in_sitemap = 1
  `).run();

  db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_matches_kickoff
    ON matches(kickoff_at)
  `).run();

  db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_matches_league
    ON matches(league_id)
  `).run();

  // Sync status table for tracking sync progress
  db.prepare(`
    CREATE TABLE IF NOT EXISTS sync_status (
      entity_type TEXT PRIMARY KEY,
      last_page INTEGER NOT NULL DEFAULT 0,
      last_sync_at TEXT,
      is_complete INTEGER NOT NULL DEFAULT 0,
      requests_this_hour INTEGER NOT NULL DEFAULT 0,
      hour_started_at TEXT
    )
  `).run();
}

/**
 * Get statistics about the cache.
 * Useful for monitoring and debugging.
 */
export function getCacheStats(): {
  leagues: number;
  teams: number;
  players: number;
  matches: number;
  totalSize: string;
} {
  const db = getDatabase();

  const leagueCount = db
    .prepare(
      "SELECT COUNT(*) as count FROM leagues WHERE include_in_sitemap = 1",
    )
    .get() as { count: number };

  const teamCount = db
    .prepare("SELECT COUNT(*) as count FROM teams WHERE include_in_sitemap = 1")
    .get() as { count: number };

  const playerCount = db
    .prepare(
      "SELECT COUNT(*) as count FROM players WHERE include_in_sitemap = 1",
    )
    .get() as { count: number };

  const matchCount = db
    .prepare(
      "SELECT COUNT(*) as count FROM matches WHERE include_in_sitemap = 1",
    )
    .get() as { count: number };

  // Get database file size
  const pageCount = db.pragma("page_count", { simple: true }) as number;
  const pageSize = db.pragma("page_size", { simple: true }) as number;
  const totalBytes = pageCount * pageSize;
  const totalSize =
    totalBytes > 1024 * 1024
      ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(totalBytes / 1024).toFixed(2)} KB`;

  return {
    leagues: leagueCount.count,
    teams: teamCount.count,
    players: playerCount.count,
    matches: matchCount.count,
    totalSize,
  };
}
