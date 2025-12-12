/**
 * Sitemap Cache Module
 *
 * SQLite-based persistent cache for sitemap generation.
 * Isolates Sportmonks API calls from sitemap routes.
 */

// Configuration
export { SITEMAP_CONFIG, type EntityType, type SupportedLang } from "./config";

// Database connection
export { closeDatabase, databaseExists, getDatabase } from "./connection";

// Schema management
export { getCacheStats, initializeSchema } from "./schema";

// Types
export type {
  LeagueCacheInput,
  LeagueRow,
  MatchCacheInput,
  MatchRow,
  MatchSitemapEntry,
  PlayerCacheInput,
  PlayerRow,
  CoachCacheInput,
  CoachRow,
  SitemapEntry,
  SyncStatus,
  TeamCacheInput,
  TeamRow,
} from "./types";

// Upsert operations
export {
  excludeFromSitemap,
  includeInSitemap,
  upsertLeague,
  upsertLeaguesBatch,
  upsertMatch,
  upsertMatchesBatch,
  upsertPlayer,
  upsertPlayersBatch,
  upsertTeam,
  upsertTeamsBatch,
} from "./upsert";

// Query operations
export {
  getCoachCount,
  getCoachesForSitemap,
  getCoachPageCount,
  getLeagueCount,
  getLeaguePageCount,
  getLeaguesForSitemap,
  getMatchCount,
  getMatchesForSitemap,
  getMatchPageCount,
  getPlayerCount,
  getPlayerPageCount,
  getPlayersForSitemap,
  getTeamCount,
  getTeamPageCount,
  getTeamsForSitemap,
  getTotalMatchCount,
} from "./queries";

// Domain-aware cache hooks
export {
  cacheFixture,
  cacheFixtures,
  cacheLeague,
  cacheLeagues,
  cachePlayerDetail,
  cacheCoachDetail,
  cacheSquadPlayer,
  cacheTeamDetail,
  cacheTeamFromFixture,
  cacheTeamSearchResult,
} from "./hooks";
