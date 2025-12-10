import { type NextRequest, NextResponse } from "next/server";
import { getPlayerById } from "@/lib/api/cached-football-api";
import { idSchema } from "@/lib/validation/schemas";
import { createErrorResponse, logError } from "@/lib/errors";
import { CACHE_PROFILES } from "@/lib/constants";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const playerId = idSchema.parse(id);
    const player = await getPlayerById(playerId);

    return NextResponse.json(
      { player },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_PROFILES.medium}, stale-while-revalidate=${CACHE_PROFILES.long}`,
        },
      }
    );
  } catch (error) {
    logError("api/players/[id]", error, {
      url: request.url,
      playerId: id,
    });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
