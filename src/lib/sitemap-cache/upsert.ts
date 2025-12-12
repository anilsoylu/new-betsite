/**
 * Upsert Functions for Sitemap Cache
 *
 * These functions insert or update entity records in the SQLite cache.
 * Uses ON CONFLICT for efficient upsert operations.
 * Includes both individual and batch operations for flexibility.
 *
 * Faz 0: DB metrics tracking
 * Faz 2: Statement caching for single upserts
 */

import type { Statement } from "better-sqlite3";
import { slugify } from "@/lib/utils";
import { getDatabase } from "./connection";
import type {
  LeagueCacheInput,
  MatchCacheInput,
  PlayerCacheInput,
  TeamCacheInput,
  CoachCacheInput,
} from "./types";

// ============================================================================
// Faz 0: DB Metrics - Track write operations
// ============================================================================

const dbMetrics = {
  singleWrites: 0,
  batchWrites: 0,
  totalWriteTimeMs: 0,
};

/**
 * Get current DB metrics snapshot
 */
export function getDbMetrics() {
  return { ...dbMetrics };
}

/**
 * Reset DB metrics (useful for testing)
 */
export function resetDbMetrics() {
  dbMetrics.singleWrites = 0;
  dbMetrics.batchWrites = 0;
  dbMetrics.totalWriteTimeMs = 0;
}

// ============================================================================
// Faz 2: Statement Cache - Avoid repeated db.prepare() calls
// ============================================================================

type StatementCache = {
  upsertLeague?: Statement;
  upsertTeam?: Statement;
  upsertPlayer?: Statement;
  upsertCoach?: Statement;
  upsertMatch?: Statement;
};

let stmtCache: StatementCache = {};

/**
 * Clear statement cache (call when DB connection changes or for testing)
 */
export function clearStatementCache(): void {
  stmtCache = {};
}

// SQL statements as constants for reuse
const SQL_UPSERT_LEAGUE = `
  INSERT INTO leagues (id, name, slug, country, logo, last_modified, updated_at, include_in_sitemap)
  VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'), 1)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    slug = excluded.slug,
    country = excluded.country,
    logo = excluded.logo,
    last_modified = datetime('now'),
    updated_at = datetime('now'),
    include_in_sitemap = 1
`;

const SQL_UPSERT_TEAM = `
  INSERT INTO teams (id, name, slug, league_id, country, logo, last_modified, updated_at, include_in_sitemap)
  VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), 1)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    slug = excluded.slug,
    league_id = COALESCE(excluded.league_id, teams.league_id),
    country = excluded.country,
    logo = excluded.logo,
    last_modified = datetime('now'),
    updated_at = datetime('now'),
    include_in_sitemap = 1
`;

const SQL_UPSERT_PLAYER = `
  INSERT INTO players (id, name, slug, team_id, country, position, last_modified, updated_at, include_in_sitemap)
  VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), 1)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    slug = excluded.slug,
    team_id = COALESCE(excluded.team_id, players.team_id),
    country = excluded.country,
    position = excluded.position,
    last_modified = datetime('now'),
    updated_at = datetime('now'),
    include_in_sitemap = 1
`;

const SQL_UPSERT_COACH = `
  INSERT INTO coaches (id, name, slug, team_id, country, last_modified, updated_at, include_in_sitemap)
  VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'), 1)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    slug = excluded.slug,
    team_id = COALESCE(excluded.team_id, coaches.team_id),
    country = excluded.country,
    last_modified = datetime('now'),
    updated_at = datetime('now'),
    include_in_sitemap = 1
`;

const SQL_UPSERT_MATCH = `
  INSERT INTO matches (id, home_team_name, away_team_name, slug, kickoff_at, league_id, league_name, last_modified, updated_at, include_in_sitemap)
  VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), 1)
  ON CONFLICT(id) DO UPDATE SET
    home_team_name = excluded.home_team_name,
    away_team_name = excluded.away_team_name,
    slug = excluded.slug,
    kickoff_at = excluded.kickoff_at,
    league_id = excluded.league_id,
    league_name = excluded.league_name,
    last_modified = datetime('now'),
    updated_at = datetime('now'),
    include_in_sitemap = 1
`;

// Lazy statement getters
function getLeagueStmt() {
  if (!stmtCache.upsertLeague) {
    stmtCache.upsertLeague = getDatabase().prepare(SQL_UPSERT_LEAGUE);
  }
  return stmtCache.upsertLeague;
}

function getTeamStmt() {
  if (!stmtCache.upsertTeam) {
    stmtCache.upsertTeam = getDatabase().prepare(SQL_UPSERT_TEAM);
  }
  return stmtCache.upsertTeam;
}

function getPlayerStmt() {
  if (!stmtCache.upsertPlayer) {
    stmtCache.upsertPlayer = getDatabase().prepare(SQL_UPSERT_PLAYER);
  }
  return stmtCache.upsertPlayer;
}

function getCoachStmt() {
  if (!stmtCache.upsertCoach) {
    stmtCache.upsertCoach = getDatabase().prepare(SQL_UPSERT_COACH);
  }
  return stmtCache.upsertCoach;
}

function getMatchStmt() {
  if (!stmtCache.upsertMatch) {
    stmtCache.upsertMatch = getDatabase().prepare(SQL_UPSERT_MATCH);
  }
  return stmtCache.upsertMatch;
}

/**
 * Upsert a single league into the cache.
 * Uses cached prepared statement for performance.
 */
export function upsertLeague(league: LeagueCacheInput): void {
  const start = performance.now();
  const stmt = getLeagueStmt();

  stmt.run(
    league.id,
    league.name,
    slugify(league.name),
    league.country ?? null,
    league.logo ?? null,
  );

  dbMetrics.singleWrites++;
  dbMetrics.totalWriteTimeMs += performance.now() - start;
}

/**
 * Upsert a single team into the cache.
 * Uses cached prepared statement for performance.
 */
export function upsertTeam(team: TeamCacheInput): void {
  const start = performance.now();
  const stmt = getTeamStmt();

  stmt.run(
    team.id,
    team.name,
    slugify(team.name),
    team.leagueId ?? null,
    team.country ?? null,
    team.logo ?? null,
  );

  dbMetrics.singleWrites++;
  dbMetrics.totalWriteTimeMs += performance.now() - start;
}

/**
 * Upsert a single player into the cache.
 * Uses cached prepared statement for performance.
 */
export function upsertPlayer(player: PlayerCacheInput): void {
  const start = performance.now();
  const stmt = getPlayerStmt();

  stmt.run(
    player.id,
    player.name,
    slugify(player.name),
    player.teamId ?? null,
    player.country ?? null,
    player.position ?? null,
  );

  dbMetrics.singleWrites++;
  dbMetrics.totalWriteTimeMs += performance.now() - start;
}

/**
 * Upsert a single coach into the cache.
 * Uses cached prepared statement for performance.
 */
export function upsertCoach(coach: CoachCacheInput): void {
  const start = performance.now();
  const stmt = getCoachStmt();

  stmt.run(
    coach.id,
    coach.name,
    slugify(coach.name),
    coach.teamId ?? null,
    coach.country ?? null,
  );

  dbMetrics.singleWrites++;
  dbMetrics.totalWriteTimeMs += performance.now() - start;
}

/**
 * Upsert a single match into the cache.
 * Uses cached prepared statement for performance.
 */
export function upsertMatch(match: MatchCacheInput): void {
  const start = performance.now();
  const stmt = getMatchStmt();
  const slug = `${slugify(match.homeTeamName)}-vs-${slugify(match.awayTeamName)}-${match.id}`;

  stmt.run(
    match.id,
    match.homeTeamName,
    match.awayTeamName,
    slug,
    match.kickoffAt,
    match.leagueId ?? null,
    match.leagueName ?? null,
  );

  dbMetrics.singleWrites++;
  dbMetrics.totalWriteTimeMs += performance.now() - start;
}

/**
 * Batch upsert leagues for efficiency during sync operations.
 * Uses a transaction for atomicity and performance.
 */
export function upsertLeaguesBatch(leagues: LeagueCacheInput[]): void {
  if (leagues.length === 0) return;

  const start = performance.now();
  const db = getDatabase();
  const stmt = db.prepare(SQL_UPSERT_LEAGUE);

  const insertMany = db.transaction((items: LeagueCacheInput[]) => {
    for (const league of items) {
      stmt.run(
        league.id,
        league.name,
        slugify(league.name),
        league.country ?? null,
        league.logo ?? null,
      );
    }
  });

  insertMany(leagues);
  dbMetrics.batchWrites++;
  dbMetrics.totalWriteTimeMs += performance.now() - start;
}

/**
 * Batch upsert teams for efficiency during sync operations.
 */
export function upsertTeamsBatch(teams: TeamCacheInput[]): void {
  if (teams.length === 0) return;

  const start = performance.now();
  const db = getDatabase();
  const stmt = db.prepare(SQL_UPSERT_TEAM);

  const insertMany = db.transaction((items: TeamCacheInput[]) => {
    for (const team of items) {
      stmt.run(
        team.id,
        team.name,
        slugify(team.name),
        team.leagueId ?? null,
        team.country ?? null,
        team.logo ?? null,
      );
    }
  });

  insertMany(teams);
  dbMetrics.batchWrites++;
  dbMetrics.totalWriteTimeMs += performance.now() - start;
}

/**
 * Batch upsert players for efficiency during sync operations.
 */
export function upsertPlayersBatch(players: PlayerCacheInput[]): void {
  if (players.length === 0) return;

  const start = performance.now();
  const db = getDatabase();
  const stmt = db.prepare(SQL_UPSERT_PLAYER);

  const insertMany = db.transaction((items: PlayerCacheInput[]) => {
    for (const player of items) {
      stmt.run(
        player.id,
        player.name,
        slugify(player.name),
        player.teamId ?? null,
        player.country ?? null,
        player.position ?? null,
      );
    }
  });

  insertMany(players);
  dbMetrics.batchWrites++;
  dbMetrics.totalWriteTimeMs += performance.now() - start;
}

/**
 * Batch upsert coaches for efficiency during sync operations.
 */
export function upsertCoachesBatch(coaches: CoachCacheInput[]): void {
  if (coaches.length === 0) return;

  const start = performance.now();
  const db = getDatabase();
  const stmt = db.prepare(SQL_UPSERT_COACH);

  const insertMany = db.transaction((items: CoachCacheInput[]) => {
    for (const coach of items) {
      stmt.run(
        coach.id,
        coach.name,
        slugify(coach.name),
        coach.teamId ?? null,
        coach.country ?? null,
      );
    }
  });

  insertMany(coaches);
  dbMetrics.batchWrites++;
  dbMetrics.totalWriteTimeMs += performance.now() - start;
}

/**
 * Batch upsert matches for efficiency during sync operations.
 */
export function upsertMatchesBatch(matches: MatchCacheInput[]): void {
  if (matches.length === 0) return;

  const start = performance.now();
  const db = getDatabase();
  const stmt = db.prepare(SQL_UPSERT_MATCH);

  const insertMany = db.transaction((items: MatchCacheInput[]) => {
    for (const match of items) {
      const slug = `${slugify(match.homeTeamName)}-vs-${slugify(match.awayTeamName)}-${match.id}`;
      stmt.run(
        match.id,
        match.homeTeamName,
        match.awayTeamName,
        slug,
        match.kickoffAt,
        match.leagueId ?? null,
        match.leagueName ?? null,
      );
    }
  });

  insertMany(matches);
  dbMetrics.batchWrites++;
  dbMetrics.totalWriteTimeMs += performance.now() - start;
}

/**
 * Soft-exclude an entity from the sitemap.
 * Sets include_in_sitemap = 0 instead of deleting.
 */
export function excludeFromSitemap(
  table: "leagues" | "teams" | "players" | "coaches" | "matches",
  id: number,
): void {
  const db = getDatabase();
  db.prepare(`UPDATE ${table} SET include_in_sitemap = 0 WHERE id = ?`).run(id);
}

/**
 * Re-include an entity in the sitemap.
 * Sets include_in_sitemap = 1.
 */
export function includeInSitemap(
  table: "leagues" | "teams" | "players" | "coaches" | "matches",
  id: number,
): void {
  const db = getDatabase();
  db.prepare(`UPDATE ${table} SET include_in_sitemap = 1 WHERE id = ?`).run(id);
}
