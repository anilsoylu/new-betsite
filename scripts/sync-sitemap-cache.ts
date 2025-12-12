#!/usr/bin/env tsx
/**
 * Sitemap Cache Sync Script
 *
 * This script populates the SQLite sitemap cache by fetching data from
 * the Sportmonks API. It handles rate limiting and panic mode.
 *
 * Usage:
 *   pnpm sync:all                                        # Sync all entities
 *   pnpm sync:coaches                                    # Sync only coaches
 *   tsx scripts/sync-sitemap-cache.ts -e leagues         # Sync only leagues
 *   tsx scripts/sync-sitemap-cache.ts -e players -m 50   # Sync players, max 50 pages
 *   tsx scripts/sync-sitemap-cache.ts --stats            # Show cache statistics
 *
 * Options:
 *   -e, --entity    Entity type to sync (leagues|teams|players|matches|coaches)
 *   -m, --max-pages Maximum pages to fetch per entity (default: 20)
 *   --stats         Show cache statistics and exit
 *   --help          Show this help message
 */

import { parseArgs } from "node:util";
import {
  closeDatabase,
  getCacheStats,
  initializeSchema,
} from "../src/lib/sitemap-cache";
import { SITEMAP_CONFIG } from "../src/lib/sitemap-cache/config";
import {
  upsertLeaguesBatch,
  upsertMatchesBatch,
  upsertPlayersBatch,
  upsertTeamsBatch,
  upsertCoachesBatch,
} from "../src/lib/sitemap-cache/upsert";

// Entity types - Faz 4: Added coaches
type EntityType = "leagues" | "teams" | "players" | "matches" | "coaches";

// Rate limit state per entity
interface RateLimitState {
  requestsThisHour: number;
  hourStartedAt: Date;
  isPanic: boolean;
  panicUntil: Date | null;
}

const state: Record<EntityType, RateLimitState> = {
  leagues: {
    requestsThisHour: 0,
    hourStartedAt: new Date(),
    isPanic: false,
    panicUntil: null,
  },
  teams: {
    requestsThisHour: 0,
    hourStartedAt: new Date(),
    isPanic: false,
    panicUntil: null,
  },
  players: {
    requestsThisHour: 0,
    hourStartedAt: new Date(),
    isPanic: false,
    panicUntil: null,
  },
  matches: {
    requestsThisHour: 0,
    hourStartedAt: new Date(),
    isPanic: false,
    panicUntil: null,
  },
  // Faz 4: Added coaches
  coaches: {
    requestsThisHour: 0,
    hourStartedAt: new Date(),
    isPanic: false,
    panicUntil: null,
  },
};

// API configuration
const API_KEY = process.env.API_SPORTMONKS_KEY;
const BASE_URL = "https://api.sportmonks.com/v3/football";

/**
 * Check if we can make another request for this entity.
 */
function checkRateLimit(entity: EntityType): boolean {
  const s = state[entity];
  const now = new Date();

  // Check panic mode
  if (s.isPanic && s.panicUntil && now < s.panicUntil) {
    const remaining = Math.ceil(
      (s.panicUntil.getTime() - now.getTime()) / 60000,
    );
    console.log(
      `[${entity}] ⏸️  Panic mode active, ${remaining} minutes remaining`,
    );
    return false;
  }

  // Reset hourly counter if hour has passed
  if (now.getTime() - s.hourStartedAt.getTime() > 3600000) {
    s.requestsThisHour = 0;
    s.hourStartedAt = now;
    s.isPanic = false;
    s.panicUntil = null;
  }

  // Check if under limit
  const limit = SITEMAP_CONFIG.RATE_LIMITS[entity];
  if (s.requestsThisHour >= limit) {
    console.log(
      `[${entity}] ⚠️  Rate limit reached (${s.requestsThisHour}/${limit})`,
    );
    return false;
  }

  return true;
}

/**
 * Enter panic mode for an entity.
 */
function enterPanicMode(entity: EntityType): void {
  const s = state[entity];
  const durationMs = SITEMAP_CONFIG.PANIC_MODE_DURATION_MINUTES * 60000;
  s.isPanic = true;
  s.panicUntil = new Date(Date.now() + durationMs);
  console.error(
    `[${entity}] 🚨 PANIC MODE activated until ${s.panicUntil.toISOString()}`,
  );
}

/**
 * Make a request to Sportmonks API.
 */
async function fetchFromApi(
  entity: EntityType,
  endpoint: string,
  params: Record<string, string | number> = {},
): Promise<{ data: unknown[]; hasMore: boolean } | null> {
  if (!checkRateLimit(entity)) {
    return null;
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: API_KEY || "",
        Accept: "application/json",
      },
    });

    state[entity].requestsThisHour++;

    if (response.status === 429) {
      console.error(`[${entity}] ❌ Rate limit exceeded (429)`);
      enterPanicMode(entity);
      return null;
    }

    if (response.status >= 500) {
      console.error(`[${entity}] ❌ Server error (${response.status})`);
      enterPanicMode(entity);
      return null;
    }

    if (!response.ok) {
      console.error(`[${entity}] ❌ API error (${response.status})`);
      return null;
    }

    const json = await response.json();
    const hasMore = json.pagination?.has_more ?? false;

    return { data: json.data || [], hasMore };
  } catch (error) {
    console.error(`[${entity}] ❌ Network error:`, error);
    enterPanicMode(entity);
    return null;
  }
}

/**
 * Sync leagues from Sportmonks API.
 */
async function syncLeagues(maxPages: number): Promise<void> {
  console.log("\n📦 Syncing leagues...");

  for (let page = 1; page <= maxPages; page++) {
    const result = await fetchFromApi("leagues", "/leagues", {
      page,
      per_page: 50,
      include: "country",
    });

    if (!result) break;

    const leagues = (result.data as Record<string, unknown>[]).map((raw) => ({
      id: raw.id as number,
      name: raw.name as string,
      country: (raw.country as Record<string, unknown>)?.name as
        | string
        | undefined,
      logo: raw.image_path as string | undefined,
    }));

    if (leagues.length > 0) {
      upsertLeaguesBatch(leagues);
      console.log(`  Page ${page}: ${leagues.length} leagues cached`);
    }

    if (!result.hasMore) {
      console.log("  ✅ All leagues synced");
      break;
    }

    // Small delay between requests
    await sleep(200);
  }
}

/**
 * Sync teams from Sportmonks API.
 */
async function syncTeams(maxPages: number): Promise<void> {
  console.log("\n📦 Syncing teams...");

  for (let page = 1; page <= maxPages; page++) {
    const result = await fetchFromApi("teams", "/teams", {
      page,
      per_page: 50,
      include: "country",
    });

    if (!result) break;

    const teams = (result.data as Record<string, unknown>[]).map((raw) => ({
      id: raw.id as number,
      name: raw.name as string,
      country: (raw.country as Record<string, unknown>)?.name as
        | string
        | undefined,
      logo: raw.image_path as string | undefined,
    }));

    if (teams.length > 0) {
      upsertTeamsBatch(teams);
      console.log(`  Page ${page}: ${teams.length} teams cached`);
    }

    if (!result.hasMore) {
      console.log("  ✅ All teams synced");
      break;
    }

    await sleep(200);
  }
}

/**
 * Sync players from Sportmonks API.
 * Note: Sportmonks doesn't have a /players list endpoint.
 * We fetch players through the /teams endpoint with players.player include.
 */
async function syncPlayers(maxPages: number): Promise<void> {
  console.log("\n📦 Syncing players (via teams endpoint)...");

  for (let page = 1; page <= maxPages; page++) {
    // Fetch teams with their squad players (use semicolon for multiple includes)
    const result = await fetchFromApi("players", "/teams", {
      page,
      per_page: 50,
      include: "players.player.position;players.player.nationality",
    });

    if (!result) break;

    const players: Array<{
      id: number;
      name: string;
      country?: string;
      position?: string;
    }> = [];

    // Extract players from teams
    for (const team of result.data as Record<string, unknown>[]) {
      const playerRelations = team.players as
        | Array<Record<string, unknown>>
        | undefined;

      if (!playerRelations) continue;

      for (const rel of playerRelations) {
        const player = rel.player as Record<string, unknown> | undefined;
        if (!player) continue;

        players.push({
          id: player.id as number,
          name:
            (player.display_name as string) ||
            (player.common_name as string) ||
            (player.name as string),
          country: (player.nationality as Record<string, unknown>)?.name as
            | string
            | undefined,
          position: (player.position as Record<string, unknown>)?.name as
            | string
            | undefined,
        });
      }
    }

    if (players.length > 0) {
      upsertPlayersBatch(players);
      console.log(`  Page ${page}: ${players.length} players cached`);
    }

    if (!result.hasMore) {
      console.log("  ✅ All players synced");
      break;
    }

    await sleep(200);
  }
}

/**
 * Sync matches (fixtures) from Sportmonks API.
 */
async function syncMatches(maxPages: number): Promise<void> {
  console.log("\n📦 Syncing matches...");

  // Calculate date range
  const now = new Date();
  const { past, future } = SITEMAP_CONFIG.MATCH_WINDOW_DAYS;
  const startDate = new Date(now.getTime() - past * 24 * 60 * 60 * 1000);
  const endDate = new Date(now.getTime() + future * 24 * 60 * 60 * 1000);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  for (let page = 1; page <= maxPages; page++) {
    const result = await fetchFromApi("matches", "/fixtures/between", {
      page,
      per_page: 50,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      include: "participants,league",
    });

    if (!result) break;

    const matches = (result.data as Record<string, unknown>[]).map((raw) => {
      const participants =
        (raw.participants as Array<Record<string, unknown>>) || [];
      const homeTeam = participants.find(
        (p) => (p.meta as Record<string, unknown>)?.location === "home",
      );
      const awayTeam = participants.find(
        (p) => (p.meta as Record<string, unknown>)?.location === "away",
      );
      const league = raw.league as Record<string, unknown> | undefined;

      return {
        id: raw.id as number,
        homeTeamName: (homeTeam?.name as string) || "Unknown",
        awayTeamName: (awayTeam?.name as string) || "Unknown",
        kickoffAt: raw.starting_at as string,
        leagueId: raw.league_id as number | undefined,
        leagueName: league?.name as string | undefined,
      };
    });

    if (matches.length > 0) {
      upsertMatchesBatch(matches);
      console.log(`  Page ${page}: ${matches.length} matches cached`);
    }

    if (!result.hasMore) {
      console.log("  ✅ All matches synced");
      break;
    }

    await sleep(200);
  }
}

/**
 * Faz 4: Sync coaches from Sportmonks API.
 * Note: Sportmonks doesn't have a /coaches list endpoint.
 * We fetch coaches through the /teams endpoint with coaches.coach include.
 */
async function syncCoaches(maxPages: number): Promise<void> {
  console.log("\n📦 Syncing coaches (via teams endpoint)...");

  for (let page = 1; page <= maxPages; page++) {
    // Fetch teams with their active coach
    const result = await fetchFromApi("coaches", "/teams", {
      page,
      per_page: 50,
      include: "coaches.coach",
    });

    if (!result) break;

    const coaches: Array<{
      id: number;
      name: string;
      country?: string;
      teamId?: number;
    }> = [];

    // Extract coaches from teams
    for (const team of result.data as Record<string, unknown>[]) {
      const teamId = team.id as number;
      const coachRelations = team.coaches as
        | Array<Record<string, unknown>>
        | undefined;

      if (!coachRelations) continue;

      // Find active coach (where active is true or end is null)
      const activeRelation = coachRelations.find((rel) => {
        return rel.active === true;
      });

      if (activeRelation?.coach) {
        const coach = activeRelation.coach as Record<string, unknown>;
        coaches.push({
          id: coach.id as number,
          name:
            (coach.display_name as string) ||
            (coach.common_name as string) ||
            (coach.name as string),
          country: (coach.nationality as Record<string, unknown>)?.name as
            | string
            | undefined,
          teamId,
        });
      }
    }

    if (coaches.length > 0) {
      upsertCoachesBatch(coaches);
      console.log(`  Page ${page}: ${coaches.length} coaches cached`);
    }

    if (!result.hasMore) {
      console.log("  ✅ All coaches synced");
      break;
    }

    await sleep(200);
  }
}

/**
 * Show cache statistics.
 */
function showStats(): void {
  initializeSchema();
  const stats = getCacheStats();

  console.log("\n📊 Sitemap Cache Statistics");
  console.log("─".repeat(40));
  console.log(`  Leagues:  ${stats.leagues.toLocaleString()}`);
  console.log(`  Teams:    ${stats.teams.toLocaleString()}`);
  console.log(`  Players:  ${stats.players.toLocaleString()}`);
  console.log(`  Coaches:  ${stats.coaches.toLocaleString()}`);
  console.log(`  Matches:  ${stats.matches.toLocaleString()}`);
  console.log("─".repeat(40));
  console.log(`  Database: ${stats.totalSize}`);
  console.log();
}

/**
 * Sleep helper.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Show help message.
 */
function showHelp(): void {
  console.log(`
Sitemap Cache Sync Script

Usage:
  bun scripts/sync-sitemap-cache.ts [options]

Options:
  -e, --entity <type>     Entity type to sync (leagues|teams|players|matches|coaches)
                          If not specified, syncs all entities
  -m, --max-pages <n>     Maximum pages to fetch per entity (default: 20)
  --stats                 Show cache statistics and exit
  --help                  Show this help message

Examples:
  bun scripts/sync-sitemap-cache.ts                    # Sync all entities
  bun scripts/sync-sitemap-cache.ts -e leagues         # Sync only leagues
  bun scripts/sync-sitemap-cache.ts -e coaches -m 100  # Sync coaches, max 100 pages
  bun scripts/sync-sitemap-cache.ts -e players -m 50   # Sync players, max 50 pages
  bun scripts/sync-sitemap-cache.ts --stats            # Show cache stats
`);
}

/**
 * Main entry point.
 */
async function main(): Promise<void> {
  // Parse command line arguments
  const { values } = parseArgs({
    options: {
      entity: { type: "string", short: "e" },
      "max-pages": { type: "string", short: "m", default: "20" },
      stats: { type: "boolean", default: false },
      help: { type: "boolean", default: false },
    },
    allowPositionals: false,
  });

  if (values.help) {
    showHelp();
    return;
  }

  // Check for API key
  if (!API_KEY && !values.stats) {
    console.error("❌ API_SPORTMONKS_KEY environment variable is required");
    process.exit(1);
  }

  // Initialize database schema
  initializeSchema();

  if (values.stats) {
    showStats();
    closeDatabase();
    return;
  }

  const maxPages = Number.parseInt(values["max-pages"] || "20", 10);
  const entityArg = values.entity as EntityType | undefined;

  console.log("🚀 Sitemap Cache Sync");
  console.log(`   Max pages: ${maxPages}`);
  console.log(`   Entities: ${entityArg || "all"}`);

  // Determine which entities to sync - Faz 4: Added coaches
  const entities: EntityType[] = entityArg
    ? [entityArg]
    : ["leagues", "teams", "players", "matches", "coaches"];

  // Run sync for each entity
  for (const entity of entities) {
    switch (entity) {
      case "leagues":
        await syncLeagues(maxPages);
        break;
      case "teams":
        await syncTeams(maxPages);
        break;
      case "players":
        await syncPlayers(maxPages);
        break;
      case "matches":
        await syncMatches(maxPages);
        break;
      case "coaches":
        await syncCoaches(maxPages);
        break;
    }
  }

  // Show final stats
  showStats();

  closeDatabase();
  console.log("✅ Sync complete!");
}

// Run main
main().catch((error) => {
  console.error("❌ Fatal error:", error);
  closeDatabase();
  process.exit(1);
});
