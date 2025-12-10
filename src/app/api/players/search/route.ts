import { NextResponse } from "next/server";
import { searchPlayers } from "@/lib/api/football-api";
import {
  playerSearchSchema,
  validateSearchParams,
} from "@/lib/validation/schemas";
import { createErrorResponse, logError } from "@/lib/errors";

export async function GET(request: Request) {
  const url = new URL(request.url);

  try {
    const { q } = validateSearchParams(playerSearchSchema, url.searchParams);
    const players = await searchPlayers(q);

    return NextResponse.json({ players });
  } catch (error) {
    logError("api/players/search", error, { url: request.url });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
