import { NextResponse } from "next/server";
import { searchTeams } from "@/lib/api/football-api";
import {
  teamSearchSchema,
  validateSearchParams,
} from "@/lib/validation/schemas";
import { createErrorResponse, logError } from "@/lib/errors";

export async function GET(request: Request) {
  const url = new URL(request.url);

  try {
    const { q } = validateSearchParams(teamSearchSchema, url.searchParams);
    const teams = await searchTeams(q);

    return NextResponse.json({ teams });
  } catch (error) {
    logError("api/teams/search", error, { url: request.url });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
