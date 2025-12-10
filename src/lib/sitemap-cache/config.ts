/**
 * Sitemap Cache Configuration
 *
 * This module defines configuration constants for the SQLite-based
 * sitemap cache system. All sitemaps read from this cache, completely
 * isolating Sportmonks API calls from sitemap generation.
 */

import path from "node:path";

export const SITEMAP_CONFIG = {
  /**
   * Path to the SQLite database file.
   * Defaults to ./data/sitemap-cache.sqlite in the project root.
   * Can be overridden via SITEMAP_CACHE_PATH environment variable.
   */
  databasePath:
    process.env.SITEMAP_CACHE_PATH ||
    path.join(process.cwd(), "data", "sitemap-cache.sqlite"),

  /**
   * Maximum URLs per sitemap page.
   * Google's limit is 50,000 URLs per sitemap file.
   * We use conservative limits to ensure fast XML generation.
   */
  PAGE_SIZE: {
    leagues: 10_000,
    teams: 25_000,
    players: 50_000,
    matches: 50_000,
  },

  /**
   * Rate limits per entity type (requests per hour).
   * Sportmonks has entity-based rate limits (~3000/hour per entity).
   * We use 2500 as a safe buffer.
   */
  RATE_LIMITS: {
    leagues: 2500,
    teams: 2500,
    players: 2500,
    matches: 2500,
  },

  /**
   * Match date window for sitemap inclusion.
   * Matches outside this window are still stored but excluded from sitemap queries.
   * This keeps sitemaps focused on relevant content.
   */
  MATCH_WINDOW_DAYS: {
    past: 30,
    future: 30,
  },

  /**
   * Supported languages for sitemap routes.
   * Currently single language; expandable for future i18n support.
   */
  SUPPORTED_LANGS: ["en"] as const,

  /**
   * Panic mode duration in minutes.
   * When rate limits are hit or API errors occur, sync operations
   * pause for this duration before retrying.
   */
  PANIC_MODE_DURATION_MINUTES: 30,
} as const;

export type SupportedLang = (typeof SITEMAP_CONFIG.SUPPORTED_LANGS)[number];
export type EntityType = "leagues" | "teams" | "players" | "matches";
