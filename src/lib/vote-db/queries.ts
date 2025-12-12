/**
 * Match Vote Database Queries
 *
 * Provides CRUD operations for match voting with atomic transactions,
 * rate limiting, and aggregate count management.
 */

import { AppError, RateLimitError } from "../errors";
import { getVoteDatabase } from "./connection";
import type {
  RateLimitResult,
  RateLimitRow,
  UserVote,
  VoteChoice,
  VoteRow,
  VoteTotals,
  VoteTotalsRow,
} from "./types";

// Rate limit configuration
const RATE_LIMITS = {
  // Normal limits (when IP is known)
  fiveMinute: { max: 30, windowMs: 5 * 60 * 1000 },
  daily: { max: 200, windowMs: 24 * 60 * 60 * 1000 },
  // Strict limits for unknown IP or empty fingerprint (prevents incognito abuse)
  unknownFiveMinute: { max: 3, windowMs: 5 * 60 * 1000 },
  unknownDaily: { max: 10, windowMs: 24 * 60 * 60 * 1000 },
} as const;

// Maximum votes per IP per fixture (prevents incognito cookie bypass)
const MAX_VOTES_PER_IP_PER_FIXTURE = 5;

// 10-second cooldown between vote changes
const CHANGE_COOLDOWN_MS = 10 * 1000;

// Maximum vote changes per fixture
const MAX_CHANGES = 3;

/**
 * Get vote totals for a fixture
 */
export function getVoteTotals(fixtureId: number): VoteTotals {
  const db = getVoteDatabase();
  const stmt = db.prepare<[number], VoteTotalsRow>(
    `SELECT * FROM match_vote_totals WHERE fixture_id = ?`,
  );
  const row = stmt.get(fixtureId);

  if (!row) {
    return {
      home: { count: 0, percentage: 0 },
      draw: { count: 0, percentage: 0 },
      away: { count: 0, percentage: 0 },
      total: 0,
    };
  }

  const total = row.total_count;
  const calcPercent = (count: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  return {
    home: { count: row.home_count, percentage: calcPercent(row.home_count) },
    draw: { count: row.draw_count, percentage: calcPercent(row.draw_count) },
    away: { count: row.away_count, percentage: calcPercent(row.away_count) },
    total,
  };
}

/**
 * Get a user's vote for a fixture
 */
export function getUserVote(
  fixtureId: number,
  voterId: string,
): UserVote | null {
  const db = getVoteDatabase();
  const stmt = db.prepare<[number, string], VoteRow>(
    `SELECT * FROM match_votes WHERE fixture_id = ? AND voter_id = ?`,
  );
  const row = stmt.get(fixtureId, voterId);

  if (!row) {
    return null;
  }

  return {
    choice: row.choice,
    changeCount: row.change_count,
    canChange: row.change_count < MAX_CHANGES,
    lastChangeAt: row.last_change_at,
  };
}

/**
 * Submit or change a vote (transactional)
 */
export function submitVote(
  fixtureId: number,
  voterId: string,
  choice: VoteChoice,
): { vote: UserVote; totals: VoteTotals; cooldownEndsAt?: number } {
  const db = getVoteDatabase();
  const now = Date.now();

  const transaction = db.transaction(() => {
    // Get existing vote
    const existingStmt = db.prepare<[number, string], VoteRow>(
      `SELECT * FROM match_votes WHERE fixture_id = ? AND voter_id = ?`,
    );
    const existing = existingStmt.get(fixtureId, voterId);

    // If same choice, no-op - just return current state
    if (existing?.choice === choice) {
      return {
        vote: {
          choice: existing.choice,
          changeCount: existing.change_count,
          canChange: existing.change_count < MAX_CHANGES,
          lastChangeAt: existing.last_change_at,
        },
        totals: getVoteTotals(fixtureId),
      };
    }

    // Check max changes limit
    if (existing && existing.change_count >= MAX_CHANGES) {
      throw new AppError("Maximum vote changes reached", "MAX_CHANGES", 403);
    }

    // Check 10-second cooldown
    if (existing?.last_change_at) {
      const timeSinceLastChange = now - existing.last_change_at;
      if (timeSinceLastChange < CHANGE_COOLDOWN_MS) {
        const retryAfter = Math.ceil(
          (CHANGE_COOLDOWN_MS - timeSinceLastChange) / 1000,
        );
        throw new AppError(
          `Please wait ${retryAfter} seconds before changing your vote`,
          "COOLDOWN",
          429,
          { retryAfter, cooldownEndsAt: existing.last_change_at + CHANGE_COOLDOWN_MS },
        );
      }
    }

    // Update totals with delta approach
    if (existing) {
      // Decrement old choice
      const decrementCol = `${existing.choice}_count`;
      db.prepare(
        `UPDATE match_vote_totals
         SET ${decrementCol} = MAX(0, ${decrementCol} - 1),
             updated_at = ?
         WHERE fixture_id = ?`,
      ).run(now, fixtureId);
    }

    // Increment new choice (or create totals row)
    const incrementCol = `${choice}_count`;
    db.prepare(
      `INSERT INTO match_vote_totals (fixture_id, ${incrementCol}, total_count, updated_at)
       VALUES (?, 1, 1, ?)
       ON CONFLICT(fixture_id) DO UPDATE SET
         ${incrementCol} = ${incrementCol} + 1,
         total_count = total_count + ${existing ? 0 : 1},
         updated_at = ?`,
    ).run(fixtureId, now, now);

    // Upsert vote record
    const newChangeCount = existing ? existing.change_count + 1 : 0;
    db.prepare(
      `INSERT INTO match_votes (fixture_id, voter_id, choice, change_count, created_at, updated_at, last_change_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(fixture_id, voter_id) DO UPDATE SET
         choice = ?,
         change_count = ?,
         updated_at = ?,
         last_change_at = ?`,
    ).run(
      fixtureId,
      voterId,
      choice,
      newChangeCount,
      now,
      now,
      existing ? now : null, // Only set last_change_at on changes
      choice,
      newChangeCount,
      now,
      existing ? now : null,
    );

    const totals = getVoteTotals(fixtureId);
    const cooldownEndsAt = existing ? now + CHANGE_COOLDOWN_MS : undefined;

    return {
      vote: {
        choice,
        changeCount: newChangeCount,
        canChange: newChangeCount < MAX_CHANGES,
        lastChangeAt: existing ? now : null,
      },
      totals,
      cooldownEndsAt,
    };
  });

  return transaction();
}

/**
 * Format bucket key for rate limiting
 */
function getBucketKeys(now: number): { fiveMin: string; day: string } {
  const date = new Date(now);

  // 5-minute bucket: floor to nearest 5 minutes
  const fiveMinSlot = Math.floor(date.getMinutes() / 5) * 5;
  const fiveMin = `5min:${date.toISOString().slice(0, 13)}:${String(fiveMinSlot).padStart(2, "0")}`;

  // Daily bucket
  const day = `day:${date.toISOString().slice(0, 10)}`;

  return { fiveMin, day };
}

/**
 * Check rate limits for an IP
 * Uses TWO layers:
 * 1. IP-only limit (catches incognito abuse regardless of fingerprint)
 * 2. IP+fingerprint limit (more granular for legitimate users)
 */
export function checkRateLimit(ip: string, fingerprint = ""): RateLimitResult {
  const db = getVoteDatabase();
  const now = Date.now();
  const buckets = getBucketKeys(now);

  // Use stricter limits for unknown IP or empty fingerprint
  const isUnknownIp = ip === "unknown";
  const isEmptyFingerprint = !fingerprint;
  const useStrictLimits = isUnknownIp || isEmptyFingerprint;

  const fiveMinLimit = useStrictLimits
    ? RATE_LIMITS.unknownFiveMinute.max
    : RATE_LIMITS.fiveMinute.max;
  const dailyLimit = useStrictLimits
    ? RATE_LIMITS.unknownDaily.max
    : RATE_LIMITS.daily.max;

  // LAYER 1: Check IP-only limit (sum of all fingerprints for this IP)
  // This catches incognito abuse where each session has different/empty fingerprint
  // Uses strict limits when IP unknown or fingerprint empty (incognito mode)
  const ipOnlyFiveMinLimit = useStrictLimits
    ? RATE_LIMITS.unknownFiveMinute.max
    : RATE_LIMITS.fiveMinute.max;
  const ipOnlyDailyLimit = useStrictLimits
    ? RATE_LIMITS.unknownDaily.max
    : RATE_LIMITS.daily.max;

  const ipOnlyStmt = db.prepare<[string, string], { total: number }>(
    `SELECT COALESCE(SUM(count), 0) as total FROM vote_rate_limits WHERE ip = ? AND bucket = ?`,
  );

  const ipFiveMinTotal = ipOnlyStmt.get(ip, buckets.fiveMin);
  if (ipFiveMinTotal && ipFiveMinTotal.total >= ipOnlyFiveMinLimit) {
    const date = new Date(now);
    const currentMinute = date.getMinutes();
    const nextWindow = Math.ceil((currentMinute + 1) / 5) * 5;
    const retryAfter = (nextWindow - currentMinute) * 60 - date.getSeconds();
    return { allowed: false, retryAfter };
  }

  const ipDayTotal = ipOnlyStmt.get(ip, buckets.day);
  if (ipDayTotal && ipDayTotal.total >= ipOnlyDailyLimit) {
    const date = new Date(now);
    const midnight = new Date(date);
    midnight.setHours(24, 0, 0, 0);
    const retryAfter = Math.ceil((midnight.getTime() - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // LAYER 2: Check IP + fingerprint specific limit (stricter for empty fingerprint)
  const stmt = db.prepare<[string, string, string], RateLimitRow>(
    `SELECT * FROM vote_rate_limits WHERE ip = ? AND fingerprint = ? AND bucket = ?`,
  );

  const fiveMinRow = stmt.get(ip, fingerprint, buckets.fiveMin);
  if (fiveMinRow && fiveMinRow.count >= fiveMinLimit) {
    const date = new Date(now);
    const currentMinute = date.getMinutes();
    const nextWindow = Math.ceil((currentMinute + 1) / 5) * 5;
    const retryAfter = (nextWindow - currentMinute) * 60 - date.getSeconds();
    return { allowed: false, retryAfter };
  }

  const dayRow = stmt.get(ip, fingerprint, buckets.day);
  if (dayRow && dayRow.count >= dailyLimit) {
    const date = new Date(now);
    const midnight = new Date(date);
    midnight.setHours(24, 0, 0, 0);
    const retryAfter = Math.ceil((midnight.getTime() - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

/**
 * Increment rate limit counters for an IP + fingerprint combination
 */
export function incrementRateLimit(ip: string, fingerprint = ""): void {
  const db = getVoteDatabase();
  const now = Date.now();
  const buckets = getBucketKeys(now);

  const upsertStmt = db.prepare(
    `INSERT INTO vote_rate_limits (ip, fingerprint, bucket, count, updated_at)
     VALUES (?, ?, ?, 1, ?)
     ON CONFLICT(ip, fingerprint, bucket) DO UPDATE SET
       count = count + 1,
       updated_at = ?`,
  );

  upsertStmt.run(ip, fingerprint, buckets.fiveMin, now, now);
  upsertStmt.run(ip, fingerprint, buckets.day, now, now);
}

/**
 * Clean up old rate limit records (older than 2 days)
 */
export function cleanupOldRateLimits(): number {
  const db = getVoteDatabase();
  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;

  const result = db
    .prepare(`DELETE FROM vote_rate_limits WHERE updated_at < ?`)
    .run(twoDaysAgo);

  return result.changes;
}

/**
 * Check and increment fixture-IP vote limit
 * This is the KEY defense against incognito spam bypass
 * Each IP can vote max N times per fixture regardless of cookie/fingerprint
 *
 * @throws AppError with code "FIXTURE_IP_LIMIT" if limit exceeded
 */
export function checkAndIncrementFixtureIpLimit(
  fixtureId: number,
  ip: string,
): void {
  const db = getVoteDatabase();
  const now = Date.now();

  // Skip enforcement for unknown IP (shouldn't happen with proper Cloudflare setup)
  if (ip === "unknown") {
    return;
  }

  // Check current vote count for this IP on this fixture
  const row = db
    .prepare<
      [number, string],
      { vote_count: number }
    >(`SELECT vote_count FROM fixture_ip_votes WHERE fixture_id = ? AND ip = ?`)
    .get(fixtureId, ip);

  if (row && row.vote_count >= MAX_VOTES_PER_IP_PER_FIXTURE) {
    throw new AppError(
      `Too many votes from this IP for this match (max ${MAX_VOTES_PER_IP_PER_FIXTURE})`,
      "FIXTURE_IP_LIMIT",
      429,
    );
  }

  // Upsert: increment vote_count or insert with 1
  db.prepare(
    `INSERT INTO fixture_ip_votes (fixture_id, ip, vote_count, updated_at)
     VALUES (?, ?, 1, ?)
     ON CONFLICT(fixture_id, ip) DO UPDATE SET
       vote_count = vote_count + 1,
       updated_at = ?`,
  ).run(fixtureId, ip, now, now);
}
