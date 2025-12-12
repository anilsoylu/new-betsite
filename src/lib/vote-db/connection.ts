/**
 * SQLite Connection Management for Match Votes
 *
 * Uses better-sqlite3 for synchronous operations.
 * Follows the same pattern as lineup-db/connection.ts
 */

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATABASE_PATH =
  process.env.VOTE_DB_PATH ||
  path.join(process.cwd(), "data", "match-votes.sqlite");

let db: Database.Database | null = null;

/**
 * Get the SQLite database instance.
 * Creates the database file and parent directories if they don't exist.
 * Uses WAL mode for better concurrent read/write performance.
 */
export function getVoteDatabase(): Database.Database {
  if (!db) {
    // Ensure the data directory exists
    const dbDir = path.dirname(DATABASE_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new Database(DATABASE_PATH);

    // Configure SQLite for optimal performance
    db.pragma("journal_mode = WAL");
    db.pragma("synchronous = NORMAL");
    db.pragma("cache_size = -16000"); // 16MB cache
    db.pragma("foreign_keys = ON");
    db.pragma("temp_store = MEMORY");

    // Initialize schema on first connection
    initializeSchema(db);
  }

  return db;
}

/**
 * Initialize the database schema
 */
function initializeSchema(database: Database.Database): void {
  // Aggregate counts table for fast percentage calculation
  database
    .prepare(
      `
    CREATE TABLE IF NOT EXISTS match_vote_totals (
      fixture_id INTEGER PRIMARY KEY,
      home_count INTEGER NOT NULL DEFAULT 0,
      draw_count INTEGER NOT NULL DEFAULT 0,
      away_count INTEGER NOT NULL DEFAULT 0,
      total_count INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL
    )
  `,
    )
    .run();

  // Individual votes table
  database
    .prepare(
      `
    CREATE TABLE IF NOT EXISTS match_votes (
      fixture_id INTEGER NOT NULL,
      voter_id TEXT NOT NULL,
      choice TEXT NOT NULL CHECK (choice IN ('home', 'draw', 'away')),
      change_count INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      last_change_at INTEGER,
      PRIMARY KEY (fixture_id, voter_id)
    )
  `,
    )
    .run();

  // IP-based rate limiting table
  database
    .prepare(
      `
    CREATE TABLE IF NOT EXISTS vote_rate_limits (
      ip TEXT NOT NULL,
      bucket TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 1,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (ip, bucket)
    )
  `,
    )
    .run();

  // Index for rate limit cleanup
  database
    .prepare(
      `
    CREATE INDEX IF NOT EXISTS idx_rate_limits_updated
    ON vote_rate_limits(updated_at)
  `,
    )
    .run();
}

/**
 * Close the database connection.
 */
export function closeVoteDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
