import { type NextRequest, NextResponse } from "next/server";
import { getCoachById } from "@/lib/api/football-api";
import { idSchema } from "@/lib/validation/schemas";
import { createErrorResponse, logError } from "@/lib/errors";
import { CACHE_PROFILES } from "@/lib/constants";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const coachId = idSchema.parse(id);
    const coach = await getCoachById(coachId);

    // Map to the format expected by favorites page
    const mappedCoach = {
      id: coach.id,
      name: coach.name,
      displayName: coach.displayName,
      image: coach.image,
      nationality: coach.nationality,
      currentTeam: coach.currentTeam
        ? {
            id: coach.currentTeam.teamId,
            name: coach.currentTeam.teamName,
            logo: coach.currentTeam.teamLogo,
          }
        : null,
    };

    return NextResponse.json(
      { coach: mappedCoach },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_PROFILES.medium}, stale-while-revalidate=${CACHE_PROFILES.long}`,
        },
      },
    );
  } catch (error) {
    logError("api/coaches/[id]", error, {
      url: request.url,
      coachId: id,
    });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
