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
  checkAndIncrementFixtureIpLimit,
} from "@/lib/vote-db/queries";
import {
  getOrCreateVoterCookie,
  setVoterCookies,
} from "@/lib/vote-cookie";
import type { VoteTotalsResponse, SubmitVoteResponse } from "@/lib/vote-db/types";

/**
 * Get client IP from request headers
 * Priority (Cloudflare + Nginx):
 * 1. CF-Connecting-IP (Cloudflare's real client IP)
 * 2. X-Forwarded-For first IP (proxy chain, first = client)
 * 3. True-Client-IP (some CDNs)
 * 4. X-Real-IP (Nginx - but may be edge IP behind Cloudflare)
 * 5. "unknown" fallback
 */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("true-client-ip") ||
    request.headers.get("x-real-ip") ||
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

/**
 * Mask IP for logging (privacy-safe)
 * Example: "212.253.197.189" -> "212.253.xxx.xxx"
 */
function maskIp(ip: string): string {
  if (ip === "unknown") return "unknown";
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.xxx.xxx`;
  }
  // IPv6 or other - just show first part
  return ip.split(":")[0] + ":xxx";
}

/**
 * Get debug headers for logging (masked for privacy)
 */
function getDebugHeaders(request: NextRequest): Record<string, string> {
  return {
    cfConnectingIp: maskIp(request.headers.get("cf-connecting-ip") || ""),
    xForwardedFor: maskIp(
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
    ),
    xRealIp: maskIp(request.headers.get("x-real-ip") || ""),
    userAgent: (request.headers.get("user-agent") || "").slice(0, 50),
  };
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
    // 1. Validate fixture ID
    const fixtureId = idSchema.parse(id);

    // 2. Validate request body
    const body = await request.json();
    const { choice } = submitVoteSchema.parse(body);

    // 3. Get client IP and fingerprint for rate limiting
    const ip = getClientIp(request);
    const fingerprint = getFingerprint(request);

    // 4. Check if voting is still open (early fail before rate limit checks)
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

    // 5. Check rate limit (IP + fingerprint combination)
    const rateLimitResult = checkRateLimit(ip, fingerprint);
    if (!rateLimitResult.allowed) {
      throw new RateLimitError(rateLimitResult.retryAfter);
    }

    // 6. Check fixture-IP limit (KEY defense against incognito bypass)
    // This ensures max N votes per IP per fixture regardless of cookie
    checkAndIncrementFixtureIpLimit(fixtureId, ip);

    // 7. Get or create voter identity
    const { voterId, isNew } = getOrCreateVoterCookie(request);

    // 8. Submit vote (transactional)
    const result = submitVote(fixtureId, voterId, choice);

    // 9. Increment rate limit counter (IP + fingerprint)
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
    // Log with masked debug headers for rate limit / IP limit debugging
    logError("api/fixtures/[id]/votes:POST", error, {
      url: request.url,
      fixtureId: id,
      ...getDebugHeaders(request),
    });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
