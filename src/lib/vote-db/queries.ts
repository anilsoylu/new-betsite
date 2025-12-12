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
  fiveMinute: { max: 30, windowMs: 5 * 60 * 1000 },
  daily: { max: 200, windowMs: 24 * 60 * 60 * 1000 },
} as const;

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
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const db = getVoteDatabase();
  const now = Date.now();
  const buckets = getBucketKeys(now);

  const stmt = db.prepare<[string, string], RateLimitRow>(
    `SELECT * FROM vote_rate_limits WHERE ip = ? AND bucket = ?`,
  );

  // Check 5-minute limit
  const fiveMinRow = stmt.get(ip, buckets.fiveMin);
  if (fiveMinRow && fiveMinRow.count >= RATE_LIMITS.fiveMinute.max) {
    // Calculate retry after (time until next 5-min window)
    const date = new Date(now);
    const currentMinute = date.getMinutes();
    const nextWindow = Math.ceil((currentMinute + 1) / 5) * 5;
    const retryAfter = (nextWindow - currentMinute) * 60 - date.getSeconds();
    return { allowed: false, retryAfter };
  }

  // Check daily limit
  const dayRow = stmt.get(ip, buckets.day);
  if (dayRow && dayRow.count >= RATE_LIMITS.daily.max) {
    // Calculate retry after (time until midnight)
    const date = new Date(now);
    const midnight = new Date(date);
    midnight.setHours(24, 0, 0, 0);
    const retryAfter = Math.ceil((midnight.getTime() - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

/**
 * Increment rate limit counters for an IP
 */
export function incrementRateLimit(ip: string): void {
  const db = getVoteDatabase();
  const now = Date.now();
  const buckets = getBucketKeys(now);

  const upsertStmt = db.prepare(
    `INSERT INTO vote_rate_limits (ip, bucket, count, updated_at)
     VALUES (?, ?, 1, ?)
     ON CONFLICT(ip, bucket) DO UPDATE SET
       count = count + 1,
       updated_at = ?`,
  );

  upsertStmt.run(ip, buckets.fiveMin, now, now);
  upsertStmt.run(ip, buckets.day, now, now);
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
