import { type NextRequest, NextResponse } from "next/server";
import {
  getFixturesByTeam,
  getFixtureById,
} from "@/lib/api/cached-football-api";
import { idSchema } from "@/lib/validation/schemas";
import { createErrorResponse, logError } from "@/lib/errors";
import { CACHE_PROFILES } from "@/lib/constants";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/teams/[id]/last-lineup
 * Returns the team's lineup and formation from their most recent match
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const teamId = idSchema.parse(id);

    // Get team's recent fixtures (last 5 past matches)
    const { recent } = await getFixturesByTeam(teamId, { past: 5, future: 0 });

    if (recent.length === 0) {
      return NextResponse.json(
        { error: "No recent matches found for this team" },
        { status: 404 }
      );
    }

    // Find the most recent finished match (prefer matches with finished status)
    const lastMatch = recent.find((f) => f.status === "finished") || recent[0];

    // Fetch full fixture details with lineups
    const fixtureDetail = await getFixtureById(lastMatch.id);

    // Determine which lineup belongs to this team
    const isHome = fixtureDetail.homeTeam.id === teamId;
    const teamLineup = isHome
      ? fixtureDetail.homeLineup
      : fixtureDetail.awayLineup;

    if (!teamLineup || teamLineup.starters.length === 0) {
      return NextResponse.json(
        { error: "No lineup data available for the last match" },
        { status: 404 }
      );
    }

    // Map starters to the response format
    const players = teamLineup.starters.map((player) => ({
      playerId: player.playerId,
      name: player.name,
      displayName: player.name,
      image: player.image,
      position: player.position,
      jerseyNumber: player.jerseyNumber,
    }));

    return NextResponse.json(
      {
        formation: teamLineup.formation,
        players,
        match: {
          id: fixtureDetail.id,
          homeTeam: fixtureDetail.homeTeam.name,
          awayTeam: fixtureDetail.awayTeam.name,
          date: fixtureDetail.timestamp,
        },
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_PROFILES.short}, stale-while-revalidate=${CACHE_PROFILES.medium}`,
        },
      }
    );
  } catch (error) {
    logError("api/teams/[id]/last-lineup", error, {
      url: request.url,
      teamId: id,
    });
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
