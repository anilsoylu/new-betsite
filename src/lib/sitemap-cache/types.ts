/**
 * Type definitions for the sitemap cache system.
 */

/**
 * Base entry returned from sitemap queries.
 * Contains minimal data needed for URL generation.
 */
export interface SitemapEntry {
  id: number;
  name: string;
  slug: string;
  lastModified: string;
}

/**
 * Match-specific sitemap entry with team names for URL generation.
 * Unlike other entities, matches don't have a single `name` field -
 * they use homeTeamName and awayTeamName instead.
 */
export interface MatchSitemapEntry {
  id: number;
  homeTeamName: string;
  awayTeamName: string;
  slug: string;
  kickoffAt: string;
  lastModified: string;
}

/**
 * Input for upserting a league into the cache.
 */
export interface LeagueCacheInput {
  id: number;
  name: string;
  country?: string | null;
  logo?: string | null;
}

/**
 * Input for upserting a team into the cache.
 */
export interface TeamCacheInput {
  id: number;
  name: string;
  leagueId?: number | null;
  country?: string | null;
  logo?: string | null;
}

/**
 * Input for upserting a player into the cache.
 */
export interface PlayerCacheInput {
  id: number;
  name: string;
  teamId?: number | null;
  country?: string | null;
  position?: string | null;
}

/**
 * Input for upserting a match into the cache.
 */
export interface MatchCacheInput {
  id: number;
  homeTeamName: string;
  awayTeamName: string;
  kickoffAt: string;
  leagueId?: number | null;
  leagueName?: string | null;
}

/**
 * Sync status record for tracking sync progress per entity.
 */
export interface SyncStatus {
  entityType: string;
  lastPage: number;
  lastSyncAt: string | null;
  isComplete: boolean;
  requestsThisHour: number;
  hourStartedAt: string | null;
}

/**
 * Database row types (internal use)
 */
export interface LeagueRow {
  id: number;
  name: string;
  slug: string;
  country: string | null;
  logo: string | null;
  last_modified: string | null;
  updated_at: string;
  include_in_sitemap: number;
}

export interface TeamRow {
  id: number;
  name: string;
  slug: string;
  league_id: number | null;
  country: string | null;
  logo: string | null;
  last_modified: string | null;
  updated_at: string;
  include_in_sitemap: number;
}

export interface PlayerRow {
  id: number;
  name: string;
  slug: string;
  team_id: number | null;
  country: string | null;
  position: string | null;
  last_modified: string | null;
  updated_at: string;
  include_in_sitemap: number;
}

export interface MatchRow {
  id: number;
  home_team_name: string;
  away_team_name: string;
  slug: string;
  kickoff_at: string;
  league_id: number | null;
  league_name: string | null;
  last_modified: string | null;
  updated_at: string;
  include_in_sitemap: number;
}
