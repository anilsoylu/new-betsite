import { type NextRequest, NextResponse } from "next/server";
import { getFixtureById } from "@/lib/api/cached-football-api";
import { idSchema } from "@/lib/validation/schemas";
import { createErrorResponse, logError } from "@/lib/errors";
import { CACHE_PROFILES } from "@/lib/constants";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const fixtureId = idSchema.parse(id);
    const fixture = await getFixtureById(fixtureId);

    return NextResponse.json(
      { fixture },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_PROFILES.short}, stale-while-revalidate=${CACHE_PROFILES.medium}`,
        },
      },
    );
  } catch (error) {
    logError("api/fixtures/[id]", error, {
      url: request.url,
      fixtureId: id,
    });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
