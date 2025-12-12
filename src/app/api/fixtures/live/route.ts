import { NextResponse } from "next/server";
import { getLiveFixtures } from "@/lib/api/football-api";
import { createErrorResponse, logError } from "@/lib/errors";

export async function GET() {
  try {
    const fixtures = await getLiveFixtures();

    return NextResponse.json(
      { fixtures },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    logError("api/fixtures/live", error);
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
