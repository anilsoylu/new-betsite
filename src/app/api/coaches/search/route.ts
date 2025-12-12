import { NextResponse } from "next/server";
import { searchCoaches } from "@/lib/api/football-api";
import { createErrorResponse, logError } from "@/lib/errors";
import {
  coachSearchSchema,
  validateSearchParams,
} from "@/lib/validation/schemas";

export async function GET(request: Request) {
  const url = new URL(request.url);

  try {
    const { q } = validateSearchParams(coachSearchSchema, url.searchParams);
    const coaches = await searchCoaches(q);

    return NextResponse.json({ coaches });
  } catch (error) {
    logError("api/coaches/search", error, { url: request.url });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
