/**
 * Match Vote Database Types
 *
 * Types for the match voting system including vote choices,
 * aggregated totals, user votes, and rate limiting.
 */

export type VoteChoice = "home" | "draw" | "away";

export interface VoteTotals {
  home: { count: number; percentage: number };
  draw: { count: number; percentage: number };
  away: { count: number; percentage: number };
  total: number;
}

export interface UserVote {
  choice: VoteChoice;
  changeCount: number;
  canChange: boolean;
  lastChangeAt: number | null;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

// Database row types
export interface VoteTotalsRow {
  fixture_id: number;
  home_count: number;
  draw_count: number;
  away_count: number;
  total_count: number;
  updated_at: number;
}

export interface VoteRow {
  fixture_id: number;
  voter_id: string;
  choice: VoteChoice;
  change_count: number;
  created_at: number;
  updated_at: number;
  last_change_at: number | null;
}

export interface RateLimitRow {
  ip: string;
  bucket: string;
  count: number;
  updated_at: number;
}

// API response types
export interface VoteTotalsResponse {
  fixtureId: number;
  totals: VoteTotals;
}

export interface UserVoteResponse {
  choice: VoteChoice | null;
  changeCount: number;
  canChange: boolean;
}

export interface SubmitVoteResponse {
  success: boolean;
  choice: VoteChoice;
  changeCount: number;
  canChange: boolean;
  totals: VoteTotals;
  cooldownEndsAt?: number;
}
