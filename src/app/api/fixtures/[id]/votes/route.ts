/**
 * Match Vote API Routes
 *
 * GET: Returns aggregated vote totals for a fixture (cacheable)
 * POST: Submit or change a vote (with rate limiting and validation)
 */

import { type NextRequest, NextResponse } from "next/server";
import { getFixtureById } from "@/lib/api/cached-football-api";
import { createErrorResponse, logError, AppError, RateLimitError } from "@/lib/errors";
import { idSchema, submitVoteSchema } from "@/lib/validation/schemas";
import {
  getVoteTotals,
  submitVote,
  checkRateLimit,
  incrementRateLimit,
} from "@/lib/vote-db/queries";
import {
  getOrCreateVoterCookie,
  setVoterCookies,
} from "@/lib/vote-cookie";
import type { VoteTotalsResponse, SubmitVoteResponse } from "@/lib/vote-db/types";

/**
 * Get client IP from request headers
 * Priority: X-Real-IP (Nginx) > X-Forwarded-For (proxy chain) > "unknown"
 */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/**
 * Get fingerprint from request header
 * Returns empty string if not provided
 */
function getFingerprint(request: NextRequest): string {
  return request.headers.get("x-vote-fp") || "";
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/fixtures/[id]/votes
 * Returns aggregated vote totals (public, cacheable)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const fixtureId = idSchema.parse(id);
    const totals = getVoteTotals(fixtureId);

    const response: VoteTotalsResponse = {
      fixtureId,
      totals,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    logError("api/fixtures/[id]/votes:GET", error, {
      url: request.url,
      fixtureId: id,
    });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

/**
 * POST /api/fixtures/[id]/votes
 * Submit or change a vote
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    // Validate fixture ID
    const fixtureId = idSchema.parse(id);

    // Validate request body
    const body = await request.json();
    const { choice } = submitVoteSchema.parse(body);

    // Get client IP and fingerprint for rate limiting
    const ip = getClientIp(request);
    const fingerprint = getFingerprint(request);

    // Check rate limit (IP + fingerprint combination)
    const rateLimitResult = checkRateLimit(ip, fingerprint);
    if (!rateLimitResult.allowed) {
      throw new RateLimitError(rateLimitResult.retryAfter);
    }

    // Get or create voter identity
    const { voterId, isNew } = getOrCreateVoterCookie(request);

    // Check if voting is still open (kickoff not passed)
    const fixture = await getFixtureById(fixtureId);
    if (!fixture) {
      throw new AppError("Fixture not found", "NOT_FOUND", 404);
    }

    const kickoffTime = new Date(fixture.startTime).getTime();
    if (Date.now() >= kickoffTime) {
      throw new AppError("Voting is closed after kickoff", "VOTING_CLOSED", 403);
    }

    if (fixture.status !== "scheduled") {
      throw new AppError("Voting is closed for this match", "VOTING_CLOSED", 403);
    }

    // Submit vote (transactional)
    const result = submitVote(fixtureId, voterId, choice);

    // Increment rate limit counter (IP + fingerprint)
    incrementRateLimit(ip, fingerprint);

    const responseData: SubmitVoteResponse = {
      success: true,
      choice: result.vote.choice,
      changeCount: result.vote.changeCount,
      canChange: result.vote.canChange,
      totals: result.totals,
      cooldownEndsAt: result.cooldownEndsAt,
    };

    // Create response
    const response = NextResponse.json(responseData);

    // Set voter cookies if newly generated
    if (isNew) {
      setVoterCookies(response, voterId);
    }

    return response;
  } catch (error) {
    logError("api/fixtures/[id]/votes:POST", error, {
      url: request.url,
      fixtureId: id,
    });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
