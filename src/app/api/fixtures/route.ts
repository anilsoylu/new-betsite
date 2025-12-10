import { NextResponse } from "next/server";
import { getFixturesByDate } from "@/lib/api/football-api";
import {
  fixturesQuerySchema,
  validateSearchParams,
} from "@/lib/validation/schemas";
import { createErrorResponse, logError } from "@/lib/errors";

export async function GET(request: Request) {
  const url = new URL(request.url);

  try {
    const { date } = validateSearchParams(
      fixturesQuerySchema,
      url.searchParams,
    );
    const fixtures = await getFixturesByDate(date);

    return NextResponse.json({ fixtures });
  } catch (error) {
    logError("api/fixtures", error, { url: request.url });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
