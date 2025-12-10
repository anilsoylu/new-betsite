import { type NextRequest, NextResponse } from "next/server";
import { getLeagueById } from "@/lib/api/cached-football-api";
import { idSchema } from "@/lib/validation/schemas";
import { createErrorResponse, logError } from "@/lib/errors";
import { CACHE_PROFILES } from "@/lib/constants";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const leagueId = idSchema.parse(id);
    const league = await getLeagueById(leagueId);

    return NextResponse.json(
      { league },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_PROFILES.long}, stale-while-revalidate=${CACHE_PROFILES.static}`,
        },
      }
    );
  } catch (error) {
    logError("api/leagues/[id]", error, {
      url: request.url,
      leagueId: id,
    });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
