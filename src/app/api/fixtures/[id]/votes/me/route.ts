/**
 * User Vote API Route
 *
 * GET: Returns the current user's vote for a fixture (private, no cache)
 */

import { type NextRequest, NextResponse } from "next/server";
import { createErrorResponse, logError } from "@/lib/errors";
import { idSchema } from "@/lib/validation/schemas";
import { getUserVote } from "@/lib/vote-db/queries";
import { getVoterIdFromRequest } from "@/lib/vote-cookie";
import type { UserVoteResponse } from "@/lib/vote-db/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/fixtures/[id]/votes/me
 * Returns the current user's vote (private, user-specific)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const fixtureId = idSchema.parse(id);

    // Get voter ID from cookie (no creation)
    const voterId = getVoterIdFromRequest(request);

    // If no valid voter cookie, return null choice
    if (!voterId) {
      const response: UserVoteResponse = {
        choice: null,
        changeCount: 0,
        canChange: true,
      };
      return NextResponse.json(response, {
        headers: {
          "Cache-Control": "private, no-store",
        },
      });
    }

    // Get user's vote
    const userVote = getUserVote(fixtureId, voterId);

    const response: UserVoteResponse = {
      choice: userVote?.choice ?? null,
      changeCount: userVote?.changeCount ?? 0,
      canChange: userVote ? userVote.canChange : true,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    logError("api/fixtures/[id]/votes/me:GET", error, {
      url: request.url,
      fixtureId: id,
    });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
