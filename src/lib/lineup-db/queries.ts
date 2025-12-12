/**
 * Lineup Database Query Functions
 *
 * CRUD operations for shared lineups using SQLite.
 */

import { nanoid } from "nanoid";
import { getLineupDatabase } from "./connection";
import type {
  BuildXILineup,
  LineupSlotPlayer,
  LineupMode,
} from "@/types/build-xi";

/**
 * Database row type for shared_lineups table
 */
interface SharedLineupRow {
  id: string;
  formation_id: string;
  mode: string;
  players: string;
  name: string | null;
  created_at: number;
  view_count: number;
  expires_at: number | null;
}

/**
 * Save a lineup and return the short ID
 */
export function saveLineup(lineup: BuildXILineup): string {
  const db = getLineupDatabase();
  const id = nanoid(8); // 8 character URL-safe ID

  // Convert players object to JSON string
  const playersJson = JSON.stringify(lineup.players);

  const stmt = db.prepare(`
    INSERT INTO shared_lineups (id, formation_id, mode, players, name, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    lineup.formationId,
    lineup.mode,
    playersJson,
    lineup.name || null,
    Date.now(),
  );

  return id;
}

/**
 * Get a lineup by short ID
 */
export function getLineupById(id: string): BuildXILineup | null {
  const db = getLineupDatabase();

  const stmt = db.prepare(`
    SELECT * FROM shared_lineups WHERE id = ?
  `);

  const row = stmt.get(id) as SharedLineupRow | undefined;

  if (!row) {
    return null;
  }

  // Parse players JSON
  const players = JSON.parse(row.players) as Record<
    string,
    LineupSlotPlayer | null
  >;

  return {
    id: row.id,
    name: row.name || "Shared Lineup",
    formationId: row.formation_id,
    mode: row.mode as LineupMode,
    players,
    createdAt: row.created_at,
    updatedAt: row.created_at,
  };
}

/**
 * Increment view count for a lineup
 */
export function incrementViewCount(id: string): void {
  const db = getLineupDatabase();

  const stmt = db.prepare(`
    UPDATE shared_lineups SET view_count = view_count + 1 WHERE id = ?
  `);

  stmt.run(id);
}

/**
 * Delete expired lineups (returns count of deleted rows)
 */
export function deleteExpiredLineups(): number {
  const db = getLineupDatabase();
  const now = Date.now();

  const stmt = db.prepare(`
    DELETE FROM shared_lineups WHERE expires_at IS NOT NULL AND expires_at < ?
  `);

  const result = stmt.run(now);
  return result.changes;
}

/**
 * Get total count of shared lineups
 */
export function getLineupCount(): number {
  const db = getLineupDatabase();

  const stmt = db.prepare(`SELECT COUNT(*) as count FROM shared_lineups`);
  const row = stmt.get() as { count: number };

  return row.count;
}

/**
 * Check if a lineup exists
 */
export function lineupExists(id: string): boolean {
  const db = getLineupDatabase();

  const stmt = db.prepare(`SELECT 1 FROM shared_lineups WHERE id = ? LIMIT 1`);
  const row = stmt.get(id);

  return row !== undefined;
}
