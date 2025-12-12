import { type NextRequest, NextResponse } from "next/server";
import { getLineupById, incrementViewCount } from "@/lib/lineup-db/queries";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/lineups/[id]
 * Retrieve a shared lineup by its short ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate ID format (8 char nanoid)
    if (!id || id.length !== 8) {
      return NextResponse.json(
        { error: "Invalid lineup ID" },
        { status: 400 }
      );
    }

    const lineup = getLineupById(id);

    if (!lineup) {
      return NextResponse.json(
        { error: "Lineup not found" },
        { status: 404 }
      );
    }

    // Increment view count (fire and forget)
    try {
      incrementViewCount(id);
    } catch {
      // Ignore view count errors
    }

    return NextResponse.json({ lineup });
  } catch (error) {
    console.error("Failed to get lineup:", error);
    return NextResponse.json(
      { error: "Failed to retrieve lineup" },
      { status: 500 }
    );
  }
}
