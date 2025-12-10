/**
 * SQLite Connection Management
 *
 * Uses better-sqlite3 for synchronous operations, which works well
 * with Next.js server components. The connection is kept as a singleton
 * within each Node.js process.
 */

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { SITEMAP_CONFIG } from "./config";

let db: Database.Database | null = null;

/**
 * Get the SQLite database instance.
 * Creates the database file and parent directories if they don't exist.
 * Uses WAL mode for better concurrent read/write performance.
 */
export function getDatabase(): Database.Database {
  if (!db) {
    // Ensure the data directory exists
    const dbDir = path.dirname(SITEMAP_CONFIG.databasePath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new Database(SITEMAP_CONFIG.databasePath);

    // Configure SQLite for optimal performance
    db.pragma("journal_mode = WAL"); // Write-Ahead Logging for better concurrency
    db.pragma("synchronous = NORMAL"); // Balance between safety and speed
    db.pragma("cache_size = -64000"); // 64MB cache (negative = KB)
    db.pragma("foreign_keys = ON"); // Enforce foreign key constraints
    db.pragma("temp_store = MEMORY"); // Store temp tables in memory
  }

  return db;
}

/**
 * Close the database connection.
 * Should be called during graceful shutdown or in scripts after completion.
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Check if the database file exists.
 * Useful for determining if initialization is needed.
 */
export function databaseExists(): boolean {
  return fs.existsSync(SITEMAP_CONFIG.databasePath);
}
