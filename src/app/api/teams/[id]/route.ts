import { type NextRequest, NextResponse } from "next/server";
import { getTeamById } from "@/lib/api/cached-football-api";
import { idSchema } from "@/lib/validation/schemas";
import { createErrorResponse, logError } from "@/lib/errors";
import { CACHE_PROFILES } from "@/lib/constants";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const teamId = idSchema.parse(id);
    const team = await getTeamById(teamId);

    return NextResponse.json(
      { team },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_PROFILES.medium}, stale-while-revalidate=${CACHE_PROFILES.long}`,
        },
      }
    );
  } catch (error) {
    logError("api/teams/[id]", error, {
      url: request.url,
      teamId: id,
    });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
