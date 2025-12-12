/**
 * Upsert Functions for Sitemap Cache
 *
 * These functions insert or update entity records in the SQLite cache.
 * Uses ON CONFLICT for efficient upsert operations.
 * Includes both individual and batch operations for flexibility.
 */

import { slugify } from "@/lib/utils";
import { getDatabase } from "./connection";
import type {
  LeagueCacheInput,
  MatchCacheInput,
  PlayerCacheInput,
  TeamCacheInput,
  CoachCacheInput,
} from "./types";

/**
 * Upsert a single league into the cache.
 */
export function upsertLeague(league: LeagueCacheInput): void {
  const db = getDatabase();
  const stmt = db.prepare(`
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
  `);

  stmt.run(
    league.id,
    league.name,
    slugify(league.name),
    league.country ?? null,
    league.logo ?? null,
  );
}

/**
 * Upsert a single team into the cache.
 */
export function upsertTeam(team: TeamCacheInput): void {
  const db = getDatabase();
  const stmt = db.prepare(`
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
  `);

  stmt.run(
    team.id,
    team.name,
    slugify(team.name),
    team.leagueId ?? null,
    team.country ?? null,
    team.logo ?? null,
  );
}

/**
 * Upsert a single player into the cache.
 */
export function upsertPlayer(player: PlayerCacheInput): void {
  const db = getDatabase();
  const stmt = db.prepare(`
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
  `);

  stmt.run(
    player.id,
    player.name,
    slugify(player.name),
    player.teamId ?? null,
    player.country ?? null,
    player.position ?? null,
  );
}

/**
 * Upsert a single coach into the cache.
 */
export function upsertCoach(coach: CoachCacheInput): void {
  const db = getDatabase();
  const stmt = db.prepare(`
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
  `);

  stmt.run(
    coach.id,
    coach.name,
    slugify(coach.name),
    coach.teamId ?? null,
    coach.country ?? null,
  );
}

/**
 * Upsert a single match into the cache.
 */
export function upsertMatch(match: MatchCacheInput): void {
  const db = getDatabase();
  const slug = `${slugify(match.homeTeamName)}-vs-${slugify(match.awayTeamName)}-${match.id}`;

  const stmt = db.prepare(`
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
  `);

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

/**
 * Batch upsert leagues for efficiency during sync operations.
 * Uses a transaction for atomicity and performance.
 */
export function upsertLeaguesBatch(leagues: LeagueCacheInput[]): void {
  if (leagues.length === 0) return;

  const db = getDatabase();
  const stmt = db.prepare(`
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
  `);

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
}

/**
 * Batch upsert teams for efficiency during sync operations.
 */
export function upsertTeamsBatch(teams: TeamCacheInput[]): void {
  if (teams.length === 0) return;

  const db = getDatabase();
  const stmt = db.prepare(`
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
  `);

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
}

/**
 * Batch upsert players for efficiency during sync operations.
 */
export function upsertPlayersBatch(players: PlayerCacheInput[]): void {
  if (players.length === 0) return;

  const db = getDatabase();
  const stmt = db.prepare(`
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
  `);

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
}

/**
 * Batch upsert coaches for efficiency during sync operations.
 */
export function upsertCoachesBatch(coaches: CoachCacheInput[]): void {
  if (coaches.length === 0) return;

  const db = getDatabase();
  const stmt = db.prepare(`
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
  `);

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
}

/**
 * Batch upsert matches for efficiency during sync operations.
 */
export function upsertMatchesBatch(matches: MatchCacheInput[]): void {
  if (matches.length === 0) return;

  const db = getDatabase();
  const stmt = db.prepare(`
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
  `);

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
