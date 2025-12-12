/**
 * SQLite Connection Management for Lineup Sharing
 *
 * Uses better-sqlite3 for synchronous operations.
 * Follows the same pattern as sitemap-cache/connection.ts
 */

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATABASE_PATH =
  process.env.LINEUP_DB_PATH ||
  path.join(process.cwd(), "data", "lineups.sqlite");

let db: Database.Database | null = null;

/**
 * Get the SQLite database instance.
 * Creates the database file and parent directories if they don't exist.
 * Uses WAL mode for better concurrent read/write performance.
 */
export function getLineupDatabase(): Database.Database {
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
 * Initialize the database schema using run() for each statement
 */
function initializeSchema(database: Database.Database): void {
  // Create table
  database
    .prepare(`
    CREATE TABLE IF NOT EXISTS shared_lineups (
      id TEXT PRIMARY KEY,
      formation_id TEXT NOT NULL,
      mode TEXT NOT NULL,
      players TEXT NOT NULL,
      name TEXT,
      created_at INTEGER NOT NULL,
      view_count INTEGER DEFAULT 0,
      expires_at INTEGER
    )
  `)
    .run();

  // Create index
  database
    .prepare(`
    CREATE INDEX IF NOT EXISTS idx_shared_lineups_created_at
    ON shared_lineups(created_at)
  `)
    .run();
}

/**
 * Close the database connection.
 */
export function closeLineupDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
